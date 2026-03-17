import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  const { count: customerCount } = await admin
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id);

  const { count: emailCount } = await admin
    .from("email_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id);

  const { data: recentEmails } = await admin
    .from("email_logs")
    .select("id, sent_at, reminder_number, status")
    .eq("user_id", id)
    .order("sent_at", { ascending: false })
    .limit(10);

  return NextResponse.json({
    profile,
    customerCount: customerCount || 0,
    emailCount: emailCount || 0,
    recentEmails: recentEmails || [],
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  // Slet fra auth.users — cascade sletter alt i public.users
  const { error } = await admin.auth.admin.deleteUser(id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
