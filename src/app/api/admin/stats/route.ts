import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Total brugere
  const { count: totalUsers } = await admin
    .from("users")
    .select("*", { count: "exact", head: true });

  // Aktive abonnementer
  const { count: activeSubscriptions } = await admin
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("subscription_status", "active");

  // MRR beregning
  const { data: plans } = await admin
    .from("users")
    .select("plan")
    .eq("subscription_status", "active");

  const mrr = (plans || []).reduce((sum, u) => {
    return sum + (u.plan === "pro" ? 449 : 149);
  }, 0);

  // E-mails sendt denne måned
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: emailsThisMonth } = await admin
    .from("email_logs")
    .select("*", { count: "exact", head: true })
    .gte("sent_at", startOfMonth.toISOString());

  // E-mails sendt totalt
  const { count: emailsTotal } = await admin
    .from("email_logs")
    .select("*", { count: "exact", head: true });

  // Seneste 5 brugere
  const { data: recentUsers } = await admin
    .from("users")
    .select("id, email, company_name, plan, subscription_status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return NextResponse.json({
    totalUsers: totalUsers || 0,
    activeSubscriptions: activeSubscriptions || 0,
    mrr,
    emailsThisMonth: emailsThisMonth || 0,
    emailsTotal: emailsTotal || 0,
    recentUsers: recentUsers || [],
  });
}
