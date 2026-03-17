import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

type Locale = "en" | "da" | "sv" | "no";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  const descriptions: Record<Locale, string> = {
    en: "Automatic review requests that increase trust, visibility, and conversions.",
    da: "Automatiske review-forespørgsler der øger tillid, synlighed og konverteringer.",
    sv: "Automatiska recensionsförfrågningar som ökar förtroende, synlighet och konverteringar.",
    no: "Automatiske anmeldelsesforespørsler som øker tillit, synlighet og konverteringer.",
  };

  return {
    title: "BusyReminder — Automatic Review Requests",
    description: descriptions[locale as Locale] || t("subtitle"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  const htmlLang: Record<Locale, string> = {
    en: "en",
    da: "da",
    sv: "sv",
    no: "no",
  };

  return (
    <html lang={htmlLang[locale as Locale] || "en"}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster richColors position="top-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
