import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "BusyReminder — Automatiske Review-Forespørgsler",
  description:
    "Automatiske review-forespørgsler der øger tillid, synlighed og konverteringer. Send automatiske e-mail-påmindelser til dine kunder og få flere anmeldelser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body className="antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
