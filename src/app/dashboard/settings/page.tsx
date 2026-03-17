"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Save,
  Loader2,
  CreditCard,
  LogOut,
  Building2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [profile, setProfile] = useState({
    company_name: "",
    sender_name: "",
    plan: "basic",
    email: "",
  });
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          company_name: data.company_name || "",
          sender_name: data.sender_name || data.company_name || "",
          plan: data.plan || "basic",
          email: user.email || "",
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("users")
      .update({
        company_name: profile.company_name,
        sender_name: profile.sender_name,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Fejl ved gemning");
    } else {
      toast.success("Indstillinger gemt");
    }
    setSaving(false);
  }

  async function handlePortal() {
    setPortalLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const { url } = await res.json();
    if (url) {
      window.location.href = url;
    } else {
      toast.error("Kunne ikke åbne Stripe Customer Portal");
    }
    setPortalLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E90FF]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Indstillinger</h1>
        <p className="text-gray-500 mt-1">Administrer din konto og abonnement</p>
      </div>

      {/* Company settings */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#1E90FF]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Virksomhedsoplysninger
            </h2>
            <p className="text-sm text-gray-500">
              Disse vises i de e-mails vi sender til dine kunder
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Virksomhedsnavn
            </label>
            <input
              type="text"
              required
              value={profile.company_name}
              onChange={(e) =>
                setProfile({ ...profile, company_name: e.target.value })
              }
              placeholder="Din Virksomhed ApS"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Afsender display-navn
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Navn der vises som afsender i e-mailene (fx &quot;Support hos Din Virksomhed&quot;)
            </p>
            <input
              type="text"
              required
              value={profile.sender_name}
              onChange={(e) =>
                setProfile({ ...profile, sender_name: e.target.value })
              }
              placeholder="Support hos Din Virksomhed"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#1E90FF] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1a7de0] transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Gem indstillinger
          </button>
        </form>
      </div>

      {/* Subscription */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#1E90FF]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Abonnement</h2>
            <p className="text-sm text-gray-500">
              Administrer dit abonnement og fakturering
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Nuværende plan</p>
              <p className="text-xl font-bold text-gray-900 capitalize">
                {profile.plan}
              </p>
            </div>
            <span className="bg-[#1E90FF] text-white px-3 py-1 rounded-full text-sm font-semibold">
              {profile.plan === "pro" ? "449 kr/md" : "149 kr/md"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePortal}
            disabled={portalLoading}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {portalLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
            Administrer abonnement (Stripe)
          </button>

          {profile.plan !== "pro" && (
            <a
              href="/auth/signup?plan=pro"
              className="w-full flex items-center justify-center gap-2 bg-[#1E90FF] text-white py-3 rounded-xl font-semibold hover:bg-[#1a7de0] transition-colors"
            >
              Opgrader til Pro — 449 kr/md
            </a>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-red-100 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Log ud
        </h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 border border-red-200 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log ud af BusyReminder
        </button>
      </div>
    </div>
  );
}
