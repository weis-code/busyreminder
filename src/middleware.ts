import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const locales = ["en", "da", "sv", "no"];

function getStrippedPath(pathname: string): string {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.replace(`/${locale}`, "") || "/";
    }
  }
  return pathname;
}

function getLocalePrefix(pathname: string): string | undefined {
  return locales.find(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for API routes and static files
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Run intl middleware
  const intlResponse = intlMiddleware(request);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl === "your_supabase_url") {
    return intlResponse || NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: unknown }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            supabaseResponse.cookies.set(name, value, options as any)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const strippedPath = getStrippedPath(pathname);
  const localePrefix = getLocalePrefix(pathname);

  const isAuthPage =
    strippedPath.startsWith("/auth/login") ||
    strippedPath.startsWith("/auth/signup");

  const isDashboard = strippedPath.startsWith("/dashboard");
  const isAdmin = strippedPath.startsWith("/admin");

  if (isDashboard && !user) {
    const url = request.nextUrl.clone();
    url.pathname = localePrefix ? `/${localePrefix}/auth/login` : "/auth/login";
    return NextResponse.redirect(url);
  }

  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = localePrefix ? `/${localePrefix}/dashboard` : "/dashboard";
    return NextResponse.redirect(url);
  }

  // Admin: kun tilladt for ADMIN_EMAIL
  if (isAdmin) {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const userEmail = user?.email?.trim().toLowerCase();
    if (!user || userEmail !== adminEmail) {
      const url = request.nextUrl.clone();
      url.pathname = localePrefix ? `/${localePrefix}/` : "/";
      return NextResponse.redirect(url);
    }
  }

  // Merge supabase cookies into intl response
  if (intlResponse) {
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return intlResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
