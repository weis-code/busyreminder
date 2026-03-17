import { createClient } from "@/lib/supabase/server";
import { Users, Mail, Clock, Plus, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  // Count customers
  const { count: totalCustomers } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  // Count pending customers (not yet finished)
  const { count: pendingCustomers } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .neq("status", "done");

  // Count emails sent this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: emailsSentThisMonth } = await supabase
    .from("email_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .gte("sent_at", startOfMonth.toISOString());

  const limit = profile?.plan === "pro" ? 500 : 100;
  const usagePercent = Math.round(((emailsSentThisMonth || 0) / limit) * 100);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hej, {profile?.company_name || user?.email?.split("@")[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Her er et overblik over din konto
        </p>
      </div>

      {/* Usage warning */}
      {usagePercent >= 90 && (
        <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            Du har brugt {usagePercent}% af din månedlige kvote.{" "}
            {profile?.plan !== "pro" && (
              <Link href="/dashboard/settings" className="font-semibold underline">
                Opgrader til Pro
              </Link>
            )}{" "}
            for at sende flere påmindelser.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500">
              Forespørgsler sendt
            </p>
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#1E90FF]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {emailsSentThisMonth || 0}
            <span className="text-base font-normal text-gray-400">
              /{limit}
            </span>
          </p>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                usagePercent >= 90 ? "bg-amber-500" : "bg-[#1E90FF]"
              }`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Denne måned</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500">Aktive kunder</p>
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {totalCustomers || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1.5">Totalt tilføjet</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500">
              Afventende påmindelser
            </p>
            <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {pendingCustomers || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1.5">Venter på næste e-mail</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500">Nuværende plan</p>
            <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 capitalize">
            {profile?.plan || "Basic"}
          </p>
          <p className="text-xs text-gray-400 mt-1.5">
            {profile?.plan === "pro" ? "449 kr/md" : "149 kr/md"}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Hurtige handlinger
          </h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/customers"
              className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 bg-[#1E90FF] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Tilføj kunder
                </p>
                <p className="text-xs text-gray-500">
                  Upload CSV eller tilføj manuelt
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/campaigns"
              className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Opsæt kampagne
                </p>
                <p className="text-xs text-gray-500">
                  Konfigurer dine påmindelser
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1E90FF] to-blue-700 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">
            Sådan fungerer det
          </h2>
          <ol className="space-y-2 text-sm text-blue-100">
            <li className="flex gap-2">
              <span className="font-bold text-white">1.</span>
              Upload dine kunder under &quot;Kunder&quot;
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-white">2.</span>
              Opsæt dit review-link under &quot;Kampagner&quot;
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-white">3.</span>
              BusyReminder sender automatisk påmindelser
            </li>
          </ol>
          <Link
            href="/dashboard/campaigns"
            className="mt-4 inline-block bg-white text-[#1E90FF] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            Kom i gang →
          </Link>
        </div>
      </div>
    </div>
  );
}
