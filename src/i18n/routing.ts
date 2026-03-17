import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "da", "sv", "no"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
