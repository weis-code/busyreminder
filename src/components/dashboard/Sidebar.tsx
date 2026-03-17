"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Megaphone, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface SidebarProps {
  user: User;
  profile: { company_name: string; plan: string } | null;
}

export default function Sidebar({ user, profile }: SidebarProps) {
  const t = useTranslations("dashboard.nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const prefix = locale === "en" ? "" : `/${locale}`;

  const navItems = [
    { href: `${prefix}/dashboard`, label: t("dashboard"), icon: LayoutDashboard },
    { href: `${prefix}/dashboard/customers`, label: t("customers"), icon: Users },
    { href: `${prefix}/dashboard/campaigns`, label: t("campaigns"), icon: Megaphone },
    { href: `${prefix}/dashboard/settings`, label: t("settings"), icon: Settings },
  ];

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`${prefix}/auth/login`);
  }

  const strippedPathname = locale !== "en" ? pathname.replace(`/${locale}`, "") : pathname;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <Link href={`${prefix}/dashboard`} className="flex items-center gap-2">
          <Image src="/logo.png" alt="BusyReminder" width={32} height={32} />
          <span className="text-lg font-bold text-gray-900">BusyReminder</span>
        </Link>
      </div>

      <div className="p-4 mx-3 mt-4 bg-blue-50 rounded-xl">
        <p className="text-xs text-gray-500 mb-0.5">Virksomhed</p>
        <p className="text-sm font-semibold text-gray-900 truncate">
          {profile?.company_name || user.email}
        </p>
        <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-[#1E90FF] text-white text-xs rounded-full font-medium capitalize">
          {profile?.plan || "basic"}
        </span>
      </div>

      <nav className="flex-1 p-3 mt-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const itemStripped = locale !== "en" ? item.href.replace(`/${locale}`, "") : item.href;
            const isActive =
              strippedPathname === itemStripped ||
              (itemStripped !== "/dashboard" && strippedPathname.startsWith(itemStripped));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive ? "bg-[#1E90FF] text-white shadow-md shadow-blue-200" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 pb-2">
        <LanguageSwitcher variant="light" />
      </div>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {t("logout")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-xl p-2 shadow-sm"
      >
        {mobileOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 z-40 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-100 flex-shrink-0">
        <SidebarContent />
      </div>
    </>
  );
}
