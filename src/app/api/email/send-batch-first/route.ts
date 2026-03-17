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

    const admin = createAdminClient();

    const [{ data: profile }, { data: campaign }] = await Promise.all([
      admin.from("users").select("*").eq("id", user.id).single(),
      admin
        .from("campaigns")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
    ]);

    if (!campaign?.review_url) {
      return NextResponse.json({ skipped: true });
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
    const remaining = limit - (emailsSent || 0);

    if (remaining <= 0) {
      return NextResponse.json({ limited: true });
    }

    // Get pending customers
    const { data: customers } = await admin
      .from("customers")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .limit(remaining);

    if (!customers || customers.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    let sent = 0;
    for (const customer of customers) {
      try {
        await sendReviewEmail({
          to: customer.email,
          customerName: customer.name,
          companyName: profile?.company_name || "Virksomheden",
          senderName:
            profile?.sender_name || profile?.company_name || "Virksomheden",
          reviewUrl: campaign.review_url,
          reminderNumber: 1,
        });

        await admin
          .from("customers")
          .update({
            status: "sent_1",
            review_sent_count: 1,
            last_sent_at: new Date().toISOString(),
          })
          .eq("id", customer.id);

        await admin.from("email_logs").insert({
          user_id: user.id,
          customer_id: customer.id,
          reminder_number: 1,
          status: "sent",
        });

        sent++;
      } catch (err) {
        console.error(`Failed to send to ${customer.email}:`, err);
      }
    }

    return NextResponse.json({ sent });
  } catch (error) {
    console.error("Batch send error:", error);
    return NextResponse.json({ error: "Email fejl" }, { status: 500 });
  }
}
