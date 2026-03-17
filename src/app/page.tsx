import Link from "next/link";
import Image from "next/image";
import {
  Upload,
  Star,
  BarChart3,
  Settings,
  Check,
  Mail,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="BusyReminder" width={36} height={36} />
              <span className="text-xl font-bold text-gray-900">
                BusyReminder
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Sådan virker det
              </Link>
              <Link
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Priser
              </Link>
              <Link
                href="#faq"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                FAQ
              </Link>
            </div>
            <Link
              href="/auth/signup"
              className="border-2 border-dashed border-[#1E90FF] text-[#1E90FF] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E90FF] hover:text-white transition-all duration-200"
            >
              START HER
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
            <Star className="w-4 h-4 text-[#1E90FF] fill-[#1E90FF]" />
            <span className="text-sm text-[#1E90FF] font-medium">
              Automatiser dine review-forespørgsler
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6">
            <span className="text-gray-900 block">GET MORE REVIEWS.</span>
            <span className="text-[#1E90FF] block">AUTOMATICALLY.</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Automatiske review-forespørgsler der øger tillid, synlighed og
            konverteringer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-[#1E90FF] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#1a7de0] transition-all duration-200 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              Kom i gang
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="border-2 border-dashed border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-[#1E90FF] hover:text-[#1E90FF] transition-all duration-200 flex items-center justify-center gap-2"
            >
              Se hvordan det virker
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"
                  />
                ))}
              </div>
              <span>200+ virksomheder bruger BusyReminder</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-1">4.9/5 gennemsnitlig rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Alt hvad du behøver
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              BusyReminder giver dig alle værktøjerne til at indsamle flere
              anmeldelser automatisk — uden teknisk opsætning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#1E90FF]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sådan virker det
            </h2>
            <p className="text-lg text-gray-500">
              Kom i gang på under 5 minutter
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector lines */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-blue-200 z-0" />

            {steps.map((step, i) => (
              <div key={i} className="relative z-10 text-center">
                <div className="w-24 h-24 bg-white border-4 border-[#1E90FF] rounded-2xl flex flex-col items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100">
                  <span className="text-3xl font-black text-[#1E90FF]">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {step.description}
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enkel prissætning
            </h2>
            <p className="text-lg text-gray-500">
              Ingen skjulte gebyrer. Opsig når som helst.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Basic */}
            <div className="border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-200 transition-all">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Basic</h3>
                <p className="text-gray-500 text-sm">Perfekt til mindre virksomheder</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-black text-gray-900">149</span>
                <span className="text-gray-500"> kr/md</span>
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
                Kom i gang
              </Link>
            </div>

            {/* Pro */}
            <div className="border-2 border-[#1E90FF] rounded-2xl p-8 relative bg-gradient-to-b from-blue-50 to-white shadow-xl shadow-blue-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#1E90FF] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  MEST POPULÆR
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Pro</h3>
                <p className="text-gray-500 text-sm">Til voksende virksomheder</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-black text-gray-900">449</span>
                <span className="text-gray-500"> kr/md</span>
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
                Kom i gang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Hyppigt stillede spørgsmål
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-[#1E90FF] to-blue-600 rounded-3xl p-16 shadow-2xl shadow-blue-200">
          <h2 className="text-4xl font-black text-white mb-4">
            Klar til at få flere anmeldelser?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Tilmeld dig i dag og begynd at sende automatiske review-forespørgsler
            til dine kunder.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-[#1E90FF] px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Kom i gang gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="BusyReminder" width={36} height={36} />
                <span className="text-xl font-bold text-white">
                  BusyReminder
                </span>
              </Link>
              <p className="text-sm leading-relaxed">
                Automatiser dine review-forespørgsler og få flere anmeldelser på
                autopilot.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Priser
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-white transition-colors">
                    Sådan virker det
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Virksomhed</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Om os
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Juridisk</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privatlivspolitik
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Vilkår og betingelser
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cookie-politik
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2024 BusyReminder. Alle rettigheder forbeholdes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Mail,
    title: "Automatiske e-mail påmindelser",
    description:
      "Send op til 3 automatiske påmindelser pr. kunde med præcist den timing du ønsker.",
  },
  {
    icon: Upload,
    title: "Upload kundeliste hurtigt",
    description:
      "Upload en CSV-fil med kunders navn og e-mail og kom i gang på sekunder.",
  },
  {
    icon: Star,
    title: "Google, Trustpilot & mere",
    description:
      "Link direkte til din Google-profil, Trustpilot eller et valgfrit anmeldelseslink.",
  },
  {
    icon: BarChart3,
    title: "Dashboard med overblik",
    description:
      "Se præcis hvilke kunder der har modtaget påmindelser og hvornår.",
  },
  {
    icon: Settings,
    title: "Simpel opsætning",
    description:
      "Ingen tekniske integrationer. Kom i gang på under 5 minutter uden kode.",
  },
  {
    icon: TrendingUp,
    title: "Mål dine resultater",
    description:
      "Følg med i dit månedlige forbrug og se din fremgang over tid.",
  },
];

const steps = [
  {
    title: "Upload dine kunder",
    description:
      "Upload en CSV-fil med dine kunders navn og e-mail, eller tilføj dem manuelt en ad gangen.",
  },
  {
    title: "BusyReminder sender påmindelser",
    description:
      "Systemet sender automatisk 1-3 venlige e-mails med dit review-link på det tidspunkt du vælger.",
  },
  {
    title: "Få flere anmeldelser automatisk",
    description:
      "Dine kunder klikker på linket og efterlader en anmeldelse. Ingen manuel opfølgning nødvendig.",
  },
];

const basicFeatures = [
  "100 review-påmindelser pr. måned",
  "Op til 3 e-mails pr. kunde",
  "Dashboard med overblik",
  "Google + Trustpilot integration",
  "CSV upload",
  "E-mail support",
];

const proFeatures = [
  "500 review-påmindelser pr. måned",
  "Op til 3 e-mails pr. kunde",
  "Dashboard med overblik",
  "Google + Trustpilot integration",
  "CSV upload",
  "Prioriteret support",
  "Alt i Basic",
];

const faqs = [
  {
    question: "Hvad er BusyReminder?",
    answer:
      "BusyReminder er en platform der automatisk sender review-forespørgsler til dine kunder via e-mail. Du uploader en kundeliste, og systemet sørger for at sende op til 3 påmindelser til hver kunde.",
  },
  {
    question: "Hvilke anmeldelsesplatforme understøttes?",
    answer:
      "BusyReminder understøtter Google, Trustpilot samt et valgfrit custom link — så du kan sende kunder til præcis den platform du ønsker.",
  },
  {
    question: "Hvad sker der når jeg når min månedlige grænse?",
    answer:
      "Når du når din månedlige grænse stopper systemet med at sende nye påmindelser. Du vil se en advarsel i dit dashboard og kan opgradere til Pro for at fortsætte.",
  },
  {
    question: "Kan jeg opsige mit abonnement?",
    answer:
      "Ja, du kan opsige dit abonnement når som helst via Stripe Customer Portal i dine indstillinger. Der er ingen binding.",
  },
  {
    question: "Er mine kunders data sikre?",
    answer:
      "Ja. Vi bruger Row Level Security i vores database, så dine data er fuldstændig isoleret fra andre brugeres data. Vi sælger aldrig dine data til tredjepart.",
  },
  {
    question: "Hvordan ser e-mailene ud?",
    answer:
      "E-mailene er enkle, professionelle og venlige. De sendes i dit virksomheds navn og indeholder et tydeligt CTA-knap der linker til dit anmeldelseslink.",
  },
];
