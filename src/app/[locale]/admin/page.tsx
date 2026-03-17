import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  Mail,
  DollarSign,
  ArrowRight,
  Activity,
} from "lucide-react";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const prefix = locale === "en" ? "" : `/${locale}`;

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect(`${prefix}/`);
  }

  const admin = createAdminClient();

  // Stats
  const { count: totalUsers } = await admin
    .from("users")
    .select("*", { count: "exact", head: true });

  const { count: activeSubscriptions } = await admin
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("subscription_status", "active");

  const { data: plans } = await admin
    .from("users")
    .select("plan")
    .eq("subscription_status", "active");

  const mrr = (plans || []).reduce((sum, u) => sum + (u.plan === "pro" ? 449 : 149), 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: emailsThisMonth } = await admin
    .from("email_logs")
    .select("*", { count: "exact", head: true })
    .gte("sent_at", startOfMonth.toISOString());

  const { count: emailsTotal } = await admin
    .from("email_logs")
    .select("*", { count: "exact", head: true });

  // Seneste brugere
  const { data: recentUsers } = await admin
    .from("users")
    .select("id, email, company_name, plan, subscription_status, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  const statCards = [
    {
      label: "Total Users",
      value: totalUsers ?? 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "MRR",
      value: `${mrr.toLocaleString()} DKK`,
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
    },
    {
      label: "Active Subscriptions",
      value: activeSubscriptions ?? 0,
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Emails This Month",
      value: emailsThisMonth ?? 0,
      icon: Mail,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
      sub: `${emailsTotal ?? 0} total`,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5 text-[#1E90FF]" />
          <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        </div>
        <p className="text-gray-500 text-sm">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`border rounded-xl p-5 ${card.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">{card.label}</p>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            {card.sub && <p className="text-xs text-gray-500 mt-1">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Recent users */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">Recent Signups</h2>
          <Link
            href={`${prefix}/admin/users`}
            className="text-[#1E90FF] text-sm hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Plan</th>
                <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {(recentUsers || []).map((u) => (
                <tr key={u.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm text-white font-medium">{u.company_name || "—"}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      u.plan === "pro"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.subscription_status === "active"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-gray-700 text-gray-400"
                    }`}>
                      {u.subscription_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(u.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`${prefix}/admin/users/${u.id}`}
                      className="text-[#1E90FF] text-xs hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
              {(!recentUsers || recentUsers.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No users yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
