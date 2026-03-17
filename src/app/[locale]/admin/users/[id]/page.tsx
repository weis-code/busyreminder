"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  CreditCard,
  Trash2,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

type UserDetail = {
  profile: {
    id: string;
    email: string;
    company_name: string;
    sender_name: string;
    plan: string;
    subscription_status: string;
    stripe_customer_id: string;
    created_at: string;
  };
  customerCount: number;
  emailCount: number;
  recentEmails: { id: string; sent_at: string; reminder_number: number; status: string }[];
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const prefix = locale === "en" ? "" : `/${locale}`;

  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [id]);

  async function changePlan(newPlan: "basic" | "pro") {
    setPlanLoading(true);
    const res = await fetch(`/api/admin/users/${id}/plan`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: newPlan }),
    });
    if (res.ok) {
      toast.success(`Plan changed to ${newPlan}`);
      setData((prev) => prev ? { ...prev, profile: { ...prev.profile, plan: newPlan } } : prev);
    } else {
      toast.error("Failed to update plan");
    }
    setPlanLoading(false);
  }

  async function deleteUser() {
    setDeleteLoading(true);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("User deleted");
      router.push(`${prefix}/admin/users`);
    } else {
      toast.error("Failed to delete user");
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-[#1E90FF]" />
      </div>
    );
  }

  if (!data?.profile) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">User not found</p>
        <Link href={`${prefix}/admin/users`} className="text-[#1E90FF] text-sm mt-2 inline-block hover:underline">
          ← Back to users
        </Link>
      </div>
    );
  }

  const { profile, customerCount, emailCount, recentEmails } = data;

  return (
    <div>
      {/* Back */}
      <Link
        href={`${prefix}/admin/users`}
        className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to users
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#1E90FF]/20 flex items-center justify-center">
                <User className="w-6 h-6 text-[#1E90FF]" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{profile.company_name || "No company name"}</h2>
                <p className="text-gray-400 text-sm">{profile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Email", value: profile.email, icon: Mail },
                { label: "Company", value: profile.company_name || "—", icon: User },
                { label: "Sender name", value: profile.sender_name || "—", icon: User },
                { label: "Stripe ID", value: profile.stripe_customer_id || "—", icon: CreditCard },
                {
                  label: "Joined",
                  value: new Date(profile.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
                  icon: User,
                },
                {
                  label: "Status",
                  value: profile.subscription_status,
                  icon: CheckCircle,
                },
              ].map((field) => (
                <div key={field.label} className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">{field.label}</p>
                  <p className="text-sm text-white font-medium truncate">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-white">{customerCount}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-1">Emails Sent (total)</p>
              <p className="text-3xl font-bold text-white">{emailCount}</p>
            </div>
          </div>

          {/* Recent email logs */}
          {recentEmails.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h3 className="text-white font-semibold">Recent Email Logs</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Reminder #</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentEmails.map((e) => (
                    <tr key={e.id}>
                      <td className="px-6 py-3 text-sm text-gray-400">
                        {new Date(e.sent_at).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-300">#{e.reminder_number}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          e.status === "sent" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                        }`}>
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {/* Plan management */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#1E90FF]" />
              Plan Management
            </h3>
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Current plan</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                profile.plan === "pro"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              }`}>
                {profile.plan}
              </span>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => changePlan("basic")}
                disabled={planLoading || profile.plan === "basic"}
                className="w-full py-2.5 rounded-xl text-sm font-medium border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {planLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Switch to Basic"}
              </button>
              <button
                onClick={() => changePlan("pro")}
                disabled={planLoading || profile.plan === "pro"}
                className="w-full py-2.5 rounded-xl text-sm font-medium bg-[#1E90FF] text-white hover:bg-[#1a7de0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {planLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Switch to Pro"}
              </button>
            </div>
          </div>

          {/* Delete */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
            <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Danger Zone
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Permanently deletes this user and all their data. This cannot be undone.
            </p>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full py-2.5 rounded-xl text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete User
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-red-400 text-center font-medium">Are you sure?</p>
                <button
                  onClick={deleteUser}
                  disabled={deleteLoading}
                  className="w-full py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Yes, delete permanently</>}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="w-full py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
