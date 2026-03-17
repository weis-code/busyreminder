import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  Upload,
  Star,
  BarChart3,
  Settings,
  Check,
  Mail,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const t = useTranslations();

  const featureIcons = [Mail, Upload, Star, BarChart3, Settings, TrendingUp];

  const featureKeys = [
    "reminders",
    "upload",
    "integrations",
    "dashboard",
    "setup",
    "plans",
  ] as const;

  const faqItems = t.raw("faq.items") as { q: string; a: string }[];
  const basicFeatures = t.raw("pricing.basic.features") as string[];
  const proFeatures = t.raw("pricing.pro.features") as string[];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="BusyReminder" width={36} height={36} />
              <span className="text-xl font-bold text-gray-900">BusyReminder</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                {t("nav.features")}
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                {t("nav.how_it_works")}
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                {t("nav.pricing")}
              </Link>
              <Link href="#faq" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                {t("nav.faq")}
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link
                href="/auth/signup"
                className="border-2 border-dashed border-[#1E90FF] text-[#1E90FF] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E90FF] hover:text-white transition-all duration-200"
              >
                {t("nav.start_here")}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
            <Star className="w-4 h-4 text-[#1E90FF] fill-[#1E90FF]" />
            <span className="text-sm text-[#1E90FF] font-medium">{t("hero.badge")}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6">
            <span className="text-gray-900 block">{t("hero.title_line1")}</span>
            <span className="text-[#1E90FF] block">{t("hero.title_line2")}</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-[#1E90FF] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#1a7de0] transition-all duration-200 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              {t("hero.cta_primary")}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="border-2 border-dashed border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-[#1E90FF] hover:text-[#1E90FF] transition-all duration-200 flex items-center justify-center"
            >
              {t("hero.cta_secondary")}
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white" />
                ))}
              </div>
              <span>200+ businesses use BusyReminder</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-1">4.9/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("features.title")}</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t("features.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureKeys.map((key, i) => {
              const Icon = featureIcons[i];
              return (
                <div key={key} className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all duration-200 group">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-6 h-6 text-[#1E90FF]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t(`features.items.${key}_title`)}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {t(`features.items.${key}_desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("how_it_works.title")}</h2>
            <p className="text-lg text-gray-500">{t("how_it_works.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-blue-200 z-0" />
            {([1, 2, 3] as const).map((n) => (
              <div key={n} className="relative z-10 text-center">
                <div className="w-24 h-24 bg-white border-4 border-[#1E90FF] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100">
                  <span className="text-3xl font-black text-[#1E90FF]">{n}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {t(`how_it_works.step${n}_title`)}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {t(`how_it_works.step${n}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("pricing.title")}</h2>
            <p className="text-lg text-gray-500">{t("pricing.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Basic */}
            <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-200 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t("pricing.basic.name")}</h3>
              <div className="my-4">
                <span className="text-5xl font-black text-gray-900">{t("pricing.basic.price")}</span>
                <span className="text-gray-500"> {t("pricing.basic.currency")}{t("pricing.monthly")}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {basicFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-[#1E90FF] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup?plan=basic"
                className="block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
              >
                {t("pricing.cta")}
              </Link>
            </div>

            {/* Pro */}
            <div className="border-2 border-[#1E90FF] rounded-2xl p-8 relative bg-gradient-to-b from-blue-50 to-white shadow-xl shadow-blue-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#1E90FF] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase">
                  {t("pricing.popular")}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t("pricing.pro.name")}</h3>
              <div className="my-4">
                <span className="text-5xl font-black text-gray-900">{t("pricing.pro.price")}</span>
                <span className="text-gray-500"> {t("pricing.pro.currency")}{t("pricing.monthly")}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {proFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-[#1E90FF] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup?plan=pro"
                className="block w-full text-center bg-[#1E90FF] text-white py-3 rounded-xl font-semibold hover:bg-[#1a7de0] transition-colors shadow-lg shadow-blue-200"
              >
                {t("pricing.cta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("faq.title")}</h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-[#1E90FF] to-blue-600 rounded-3xl p-16 shadow-2xl shadow-blue-200">
          <h2 className="text-4xl font-black text-white mb-4">{t("hero.title_line1")}</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">{t("hero.subtitle")}</p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-[#1E90FF] px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-colors shadow-lg"
          >
            {t("hero.cta_primary")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="BusyReminder" width={36} height={36} />
                <span className="text-xl font-bold text-white">BusyReminder</span>
              </Link>
              <p className="text-sm leading-relaxed">{t("footer.tagline")}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t("footer.product")}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white transition-colors">{t("footer.features")}</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">{t("footer.pricing")}</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition-colors">{t("footer.login")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">{t("footer.terms")}</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">{t("footer.privacy")}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 BusyReminder. {t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
