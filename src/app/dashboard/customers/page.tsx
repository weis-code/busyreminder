"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Upload,
  Plus,
  Users,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";

type Customer = {
  id: string;
  name: string;
  email: string;
  status: string;
  review_sent_count: number;
  last_sent_at: string | null;
  created_at: string;
};

const statusConfig = {
  pending: {
    label: "Afventer",
    icon: Clock,
    className: "bg-gray-100 text-gray-600",
  },
  sent_1: {
    label: "1. sendt",
    icon: Mail,
    className: "bg-blue-100 text-blue-700",
  },
  sent_2: {
    label: "2. sendt",
    icon: Mail,
    className: "bg-blue-100 text-blue-700",
  },
  sent_3: {
    label: "3. sendt",
    icon: Mail,
    className: "bg-blue-100 text-blue-700",
  },
  done: {
    label: "Færdig",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-700",
  },
  unsubscribed: {
    label: "Afmeldt",
    icon: XCircle,
    className: "bg-red-100 text-red-600",
  },
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingManual, setAddingManual] = useState(false);
  const [uploadingCSV, setUploadingCSV] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function loadCustomers() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setCustomers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function handleAddManual(e: React.FormEvent) {
    e.preventDefault();
    setAddingManual(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("customers").insert({
      user_id: user.id,
      name: newCustomer.name,
      email: newCustomer.email,
      status: "pending",
      review_sent_count: 0,
    });

    if (error) {
      if (error.code === "23505") {
        toast.error("Denne e-mail er allerede tilføjet");
      } else {
        toast.error("Fejl ved tilføjelse af kunde");
      }
    } else {
      toast.success("Kunde tilføjet");
      setNewCustomer({ name: "", email: "" });
      setShowForm(false);
      loadCustomers();

      // Trigger first email
      await fetch("/api/email/send-first", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerEmail: newCustomer.email }),
      });
    }

    setAddingManual(false);
  }

  async function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCSV(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as { name?: string; email?: string; Name?: string; Email?: string }[];
        const customers = rows
          .filter((r) => (r.email || r.Email) && (r.name || r.Name))
          .map((r) => ({
            user_id: user.id,
            name: (r.name || r.Name || "").trim(),
            email: (r.email || r.Email || "").trim().toLowerCase(),
            status: "pending",
            review_sent_count: 0,
          }));

        if (customers.length === 0) {
          toast.error(
            'CSV-filen skal have kolonner "name" og "email"'
          );
          setUploadingCSV(false);
          return;
        }

        const { error } = await supabase
          .from("customers")
          .upsert(customers, { onConflict: "user_id,email", ignoreDuplicates: true });

        if (error) {
          toast.error("Fejl ved upload af CSV");
        } else {
          toast.success(`${customers.length} kunder uploadet`);
          loadCustomers();

          // Trigger first emails
          await fetch("/api/email/send-batch-first", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
          });
        }

        setUploadingCSV(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      error: () => {
        toast.error("Kunne ikke læse CSV-filen");
        setUploadingCSV(false);
      },
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kunder</h1>
          <p className="text-gray-500 mt-1">
            {customers.length} kunder tilføjet totalt
          </p>
        </div>
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingCSV}
            className="flex items-center gap-2 border-2 border-dashed border-gray-300 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:border-[#1E90FF] hover:text-[#1E90FF] transition-all disabled:opacity-50"
          >
            {uploadingCSV ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload CSV
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#1E90FF] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a7de0] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tilføj kunde
          </button>
        </div>
      </div>

      {/* CSV info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
        <strong>CSV format:</strong> Filen skal have kolonner:{" "}
        <code className="bg-blue-100 px-1 rounded">name</code> og{" "}
        <code className="bg-blue-100 px-1 rounded">email</code>
      </div>

      {/* Manual add form */}
      {showForm && (
        <div className="mb-6 bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tilføj enkelt kunde
          </h2>
          <form onSubmit={handleAddManual} className="flex gap-3 flex-wrap">
            <input
              type="text"
              required
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              placeholder="Kundens navn"
              className="flex-1 min-w-[180px] px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
            />
            <input
              type="email"
              required
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              placeholder="kunde@email.dk"
              className="flex-1 min-w-[220px] px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
            />
            <button
              type="submit"
              disabled={addingManual}
              className="bg-[#1E90FF] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a7de0] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {addingManual ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Tilføj
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
            >
              Annuller
            </button>
          </form>
        </div>
      )}

      {/* Customers table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E90FF]" />
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ingen kunder endnu
            </h3>
            <p className="text-gray-500 text-sm max-w-sm">
              Upload en CSV-fil eller tilføj kunder manuelt for at komme i gang
              med at sende review-forespørgsler.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">
                    NAVN
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">
                    E-MAIL
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">
                    STATUS
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">
                    E-MAILS SENDT
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">
                    SIDST SENDT
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => {
                  const status =
                    statusConfig[customer.status as keyof typeof statusConfig] ||
                    statusConfig.pending;
                  return (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.className}`}
                        >
                          <status.icon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {customer.review_sent_count}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {customer.last_sent_at
                          ? new Date(customer.last_sent_at).toLocaleDateString(
                              "da-DK"
                            )
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
