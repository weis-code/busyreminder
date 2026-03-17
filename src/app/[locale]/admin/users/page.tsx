"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Search, Users, ArrowRight, Loader2 } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  company_name: string;
  plan: string;
  subscription_status: string;
  created_at: string;
  customer_count: number;
  email_count: number;
};

export default function AdminUsersPage() {
  const locale = useLocale();
  const prefix = locale === "en" ? "" : `/${locale}`;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<"all" | "basic" | "pro">("all");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => { setUsers(d.users || []); setLoading(false); });
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.company_name?.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "all" || u.plan === planFilter;
    return matchSearch && matchPlan;
  });

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-[#1E90FF]" />
          <h1 className="text-2xl font-bold text-white">Users</h1>
        </div>
        <p className="text-gray-500 text-sm">{users.length} total users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by email or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#1E90FF]"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "basic", "pro"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                planFilter === p
                  ? "bg-[#1E90FF] text-white"
                  : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#1E90FF]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Plan</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Customers</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Emails Sent</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((u) => (
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
                    <td className="px-6 py-4 text-sm text-gray-300">{u.customer_count}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{u.email_count}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(u.created_at).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`${prefix}/admin/users/${u.id}`}
                        className="inline-flex items-center gap-1 text-[#1E90FF] text-xs hover:underline"
                      >
                        Manage <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                      {search ? "No users match your search" : "No users yet"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
