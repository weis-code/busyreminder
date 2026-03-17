import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendReviewEmail } from "@/lib/email";

// Vercel Cron Job — runs daily at 08:00 UTC
// Configured in vercel.json

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  let totalSent = 0;

  try {
    // Get all active users with campaigns
    const { data: users } = await admin
      .from("users")
      .select("*")
      .in("subscription_status", ["active", null]);

    if (!users || users.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    for (const user of users) {
      try {
        // Get user's campaign
        const { data: campaign } = await admin
          .from("campaigns")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!campaign?.review_url) continue;

        // Check monthly limit
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: emailsSent } = await admin
          .from("email_logs")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("sent_at", startOfMonth.toISOString());

        const limit = user.plan === "pro" ? 500 : 100;
        if ((emailsSent || 0) >= limit) continue;

        const remaining = limit - (emailsSent || 0);
        const now = new Date();

        // Process customers that need reminder 2 (status = sent_1)
        if (campaign.reminder_count >= 2) {
          const cutoff2 = new Date(now);
          cutoff2.setDate(cutoff2.getDate() - campaign.interval_days);

          const { data: customers2 } = await admin
            .from("customers")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "sent_1")
            .lte("last_sent_at", cutoff2.toISOString())
            .limit(remaining);

          for (const customer of customers2 || []) {
            try {
              await sendReviewEmail({
                to: customer.email,
                customerName: customer.name,
                companyName: user.company_name || "Virksomheden",
                senderName:
                  user.sender_name || user.company_name || "Virksomheden",
                reviewUrl: campaign.review_url,
                reminderNumber: 2,
              });

              await admin
                .from("customers")
                .update({
                  status: campaign.reminder_count >= 3 ? "sent_2" : "done",
                  review_sent_count: 2,
                  last_sent_at: now.toISOString(),
                })
                .eq("id", customer.id);

              await admin.from("email_logs").insert({
                user_id: user.id,
                customer_id: customer.id,
                reminder_number: 2,
                status: "sent",
              });

              totalSent++;
            } catch (err) {
              console.error(`Failed reminder 2 for ${customer.email}:`, err);
            }
          }
        }

        // Process customers that need reminder 3 (status = sent_2)
        if (campaign.reminder_count >= 3) {
          const cutoff3 = new Date(now);
          cutoff3.setDate(cutoff3.getDate() - campaign.interval_days);

          const { data: customers3 } = await admin
            .from("customers")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "sent_2")
            .lte("last_sent_at", cutoff3.toISOString())
            .limit(remaining);

          for (const customer of customers3 || []) {
            try {
              await sendReviewEmail({
                to: customer.email,
                customerName: customer.name,
                companyName: user.company_name || "Virksomheden",
                senderName:
                  user.sender_name || user.company_name || "Virksomheden",
                reviewUrl: campaign.review_url,
                reminderNumber: 3,
              });

              await admin
                .from("customers")
                .update({
                  status: "done",
                  review_sent_count: 3,
                  last_sent_at: now.toISOString(),
                })
                .eq("id", customer.id);

              await admin.from("email_logs").insert({
                user_id: user.id,
                customer_id: customer.id,
                reminder_number: 3,
                status: "sent",
              });

              totalSent++;
            } catch (err) {
              console.error(`Failed reminder 3 for ${customer.email}:`, err);
            }
          }
        }
      } catch (err) {
        console.error(`Error processing user ${user.id}:`, err);
      }
    }

    console.log(`Cron: Sent ${totalSent} reminders`);
    return NextResponse.json({ sent: totalSent });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: "Cron fejl" }, { status: 500 });
  }
}
