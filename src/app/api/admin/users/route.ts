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

  const { data: users, error } = await admin
    .from("users")
    .select("id, email, company_name, plan, subscription_status, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Tilføj kunde-tæller og email-tæller pr bruger
  const usersWithStats = await Promise.all(
    (users || []).map(async (u) => {
      const { count: customerCount } = await admin
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("user_id", u.id);

      const { count: emailCount } = await admin
        .from("email_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", u.id);

      return { ...u, customer_count: customerCount || 0, email_count: emailCount || 0 };
    })
  );

  return NextResponse.json({ users: usersWithStats });
}
