import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isUserDashboardRoute = pathname.startsWith("/user-dashboard");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (!isUserDashboardRoute && !isDashboardRoute) {
    return NextResponse.next();
  }

  // Check session via internal API to avoid Edge Runtime DB issues
  const sessionResponse = await fetch(new URL("/api/auth/get-session", request.url), {
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const session = sessionResponse.ok ? await sessionResponse.json() : null;
  const user = session?.user;

  if (!user) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, request.url));
  }

  // Super users can access both dashboards
  const isSuperUser = user.isSuperUser === true || user.isSuperUser === "true";

  console.log("[Middleware] User:", user.email, "Role:", user.role, "isSuperUser:", isSuperUser);

  // user-dashboard is only for customers (but super-users can access anything)
  if (isUserDashboardRoute && user.role !== "customer" && !isSuperUser) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // dashboard is for admins/vendors only (super-users bypass)
  if (isDashboardRoute && user.role === "customer" && !isSuperUser) {
    return NextResponse.redirect(new URL("/user-dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/user-dashboard/:path*"],
};
