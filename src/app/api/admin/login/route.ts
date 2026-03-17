import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: "Forkert password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  // Sæt admin session cookie (HttpOnly, Secure, 7 dage)
  response.cookies.set("admin_session", adminPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 dage
    path: "/",
  });

  return response;
}
