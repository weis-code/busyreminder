import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Users, LogOut, Shield } from "lucide-react";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const prefix = locale === "en" ? "" : `/${locale}`;

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect(`${prefix}/`);
  }

  const navItems = [
    { href: `${prefix}/admin`, label: "Overview", icon: LayoutDashboard, exact: true },
    { href: `${prefix}/admin/users`, label: "Users", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <div className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-800">
          <Link href={`${prefix}/admin`} className="flex items-center gap-2">
            <Image src="/logo.png" alt="BusyReminder" width={28} height={28} />
            <div>
              <span className="text-sm font-bold text-white block">BusyReminder</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Admin
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 mt-1">
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider px-3 mb-2">Menu</p>
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-t border-gray-800">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <Link
            href={`${prefix}/dashboard`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-950">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
