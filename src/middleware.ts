import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const locales = ["en", "da", "sv", "no"];
const ADMIN_COOKIE = "admin_session";

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

  // Skip for API routes, static files, and non-locale admin routes
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/admin/login" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Run intl middleware
  const intlResponse = intlMiddleware(request);

  const strippedPath = getStrippedPath(pathname);
  const localePrefix = getLocalePrefix(pathname);

  // Admin: cookie-baseret adgang (uafhængig af Supabase)
  const isAdminLogin = strippedPath === "/admin/login";
  const isAdmin = strippedPath.startsWith("/admin") && !isAdminLogin;

  if (isAdmin) {
    const adminSession = request.cookies.get(ADMIN_COOKIE)?.value;
    const validSession = process.env.ADMIN_PASSWORD;
    if (!adminSession || adminSession !== validSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

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

  const isAuthPage =
    strippedPath.startsWith("/auth/login") ||
    strippedPath.startsWith("/auth/signup");

  const isDashboard = strippedPath.startsWith("/dashboard");

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
