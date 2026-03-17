import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Betaling gennemført!
      </h1>
      <p className="text-gray-500 max-w-sm mb-8">
        Velkommen til BusyReminder! Din konto er nu aktiveret. Begynd med at
        tilføje dine kunder.
      </p>
      <div className="flex gap-3">
        <Link
          href="/dashboard/customers"
          className="flex items-center gap-2 bg-[#1E90FF] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1a7de0] transition-colors"
        >
          Tilføj første kunder
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/dashboard/campaigns"
          className="flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Opsæt kampagne
        </Link>
      </div>
    </div>
  );
}
