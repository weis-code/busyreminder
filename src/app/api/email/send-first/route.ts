import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendReviewEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerEmail } = await req.json();

    const admin = createAdminClient();

    // Get user profile and campaign
    const [{ data: profile }, { data: campaign }, { data: customer }] =
      await Promise.all([
        admin.from("users").select("*").eq("id", user.id).single(),
        admin
          .from("campaigns")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single(),
        admin
          .from("customers")
          .select("*")
          .eq("user_id", user.id)
          .eq("email", customerEmail)
          .single(),
      ]);

    if (!campaign?.review_url) {
      // No campaign set up yet, skip
      return NextResponse.json({ skipped: true });
    }

    if (!customer) {
      return NextResponse.json({ error: "Kunde ikke fundet" }, { status: 404 });
    }

    // Check monthly limit
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: emailsSent } = await admin
      .from("email_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("sent_at", startOfMonth.toISOString());

    const limit = profile?.plan === "pro" ? 500 : 100;
    if ((emailsSent || 0) >= limit) {
      return NextResponse.json({ limited: true });
    }

    // Send email
    await sendReviewEmail({
      to: customer.email,
      customerName: customer.name,
      companyName: profile?.company_name || "Virksomheden",
      senderName:
        profile?.sender_name || profile?.company_name || "Virksomheden",
      reviewUrl: campaign.review_url,
      reminderNumber: 1,
    });

    // Update customer
    await admin
      .from("customers")
      .update({
        status: "sent_1",
        review_sent_count: 1,
        last_sent_at: new Date().toISOString(),
      })
      .eq("id", customer.id);

    // Log email
    await admin.from("email_logs").insert({
      user_id: user.id,
      customer_id: customer.id,
      reminder_number: 1,
      status: "sent",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send first email error:", error);
    return NextResponse.json({ error: "Email fejl" }, { status: 500 });
  }
}
