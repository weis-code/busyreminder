"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2, Mail, ExternalLink, Eye } from "lucide-react";
import { toast } from "sonner";

type Campaign = {
  id: string;
  review_url: string;
  reminder_count: number;
  interval_days: number;
};

export default function CampaignsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<{ company_name: string } | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [form, setForm] = useState({
    review_url: "",
    reminder_count: 3,
    interval_days: 7,
  });
  const [showPreview, setShowPreview] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: prof }, { data: camp }] = await Promise.all([
        supabase.from("users").select("company_name").eq("id", user.id).single(),
        supabase
          .from("campaigns")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single(),
      ]);

      setProfile(prof);
      if (camp) {
        setCampaign(camp);
        setForm({
          review_url: camp.review_url || "",
          reminder_count: camp.reminder_count || 3,
          interval_days: camp.interval_days || 7,
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

    if (campaign) {
      const { error } = await supabase
        .from("campaigns")
        .update(form)
        .eq("id", campaign.id);
      if (error) {
        toast.error("Fejl ved gemning");
      } else {
        toast.success("Kampagne opdateret");
      }
    } else {
      const { data, error } = await supabase
        .from("campaigns")
        .insert({ ...form, user_id: user.id })
        .select()
        .single();
      if (error) {
        toast.error("Fejl ved oprettelse");
      } else {
        setCampaign(data);
        toast.success("Kampagne oprettet");
      }
    }

    setSaving(false);
  }

  const companyName = profile?.company_name || "Din Virksomhed";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E90FF]" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kampagner</h1>
        <p className="text-gray-500 mt-1">
          Opsæt dit review-link og konfigurer dine påmindelser
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Kampagneindstillinger
            </h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Review-link
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Dit Google My Business-, Trustpilot- eller custom anmeldelseslink
                </p>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    required
                    value={form.review_url}
                    onChange={(e) =>
                      setForm({ ...form, review_url: e.target.value })
                    }
                    placeholder="https://g.page/r/din-virksomhed/review"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  />
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        review_url: "https://g.page/r/YOUR_GOOGLE_ID/review",
                      })
                    }
                    className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        review_url:
                          "https://www.trustpilot.com/review/din-virksomhed.dk",
                      })
                    }
                    className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Trustpilot
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Antal påmindelser
                  </label>
                  <select
                    value={form.reminder_count}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        reminder_count: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] bg-white"
                  >
                    <option value={1}>1 e-mail</option>
                    <option value={2}>2 e-mails</option>
                    <option value={3}>3 e-mails</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Interval mellem e-mails
                  </label>
                  <select
                    value={form.interval_days}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        interval_days: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF] bg-white"
                  >
                    <option value={3}>3 dage</option>
                    <option value={5}>5 dage</option>
                    <option value={7}>7 dage</option>
                    <option value={14}>14 dage</option>
                  </select>
                </div>
              </div>

              {/* Timeline visualization */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Tidslinje for en kunde
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#1E90FF] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    <span className="text-xs text-gray-600">Dag 0</span>
                  </div>
                  {form.reminder_count >= 2 && (
                    <>
                      <div className="flex-1 h-0.5 bg-blue-200 min-w-[20px]" />
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#1E90FF] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          2
                        </div>
                        <span className="text-xs text-gray-600">
                          Dag {form.interval_days}
                        </span>
                      </div>
                    </>
                  )}
                  {form.reminder_count >= 3 && (
                    <>
                      <div className="flex-1 h-0.5 bg-blue-200 min-w-[20px]" />
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#1E90FF] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          3
                        </div>
                        <span className="text-xs text-gray-600">
                          Dag {form.interval_days * 2}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex-1 h-0.5 bg-gray-200 min-w-[20px]" />
                  <span className="text-xs text-gray-400">Stop</span>
                </div>
              </div>

              <div className="flex gap-3">
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
                  Gem kampagne
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? "Skjul preview" : "Forhåndsvis e-mail"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Email preview */}
        <div>
          {showPreview && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-700">
                    E-mail preview
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Emne: Kan du hjælpe os med en hurtig anmeldelse?
                </p>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2">
                    <div className="bg-[#1E90FF] rounded-lg p-1">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-gray-900">{companyName}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4">
                  Hej [Navn],
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  Tak fordi du valgte <strong>{companyName}</strong>. Vi håber,
                  du er tilfreds!
                </p>
                <p className="text-sm text-gray-700 mb-6">
                  Det ville betyde utroligt meget for os, hvis du ville tage 2
                  minutter og efterlade en anmeldelse.
                </p>

                <a
                  href={form.review_url || "#"}
                  className="block w-full text-center bg-[#1E90FF] text-white py-3 rounded-xl font-semibold text-sm mb-6"
                >
                  Skriv en anmeldelse →
                </a>

                <p className="text-sm text-gray-700">
                  Venlig hilsen,
                  <br />
                  <strong>{companyName}</strong>
                </p>

                <hr className="my-4 border-gray-100" />
                <p className="text-xs text-gray-400 text-center">
                  Du modtager denne e-mail fordi du har været kunde hos{" "}
                  {companyName}.{" "}
                  <a href="#" className="underline">
                    Afmeld
                  </a>
                </p>
              </div>
            </div>
          )}

          {!showPreview && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-[#1E90FF] font-bold">•</span>
                  Find dit Google-link i Google My Business
                </li>
                <li className="flex gap-2">
                  <span className="text-[#1E90FF] font-bold">•</span>
                  3 påmindelser giver den bedste svarprocent
                </li>
                <li className="flex gap-2">
                  <span className="text-[#1E90FF] font-bold">•</span>
                  7 dages interval er ideelt
                </li>
                <li className="flex gap-2">
                  <span className="text-[#1E90FF] font-bold">•</span>
                  E-mails sendes automatisk hver nat
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
