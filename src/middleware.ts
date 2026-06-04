import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isUserDashboardRoute = pathname.startsWith("/user-dashboard");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname.startsWith("/auth/");

  // Allow auth routes (including verify-email) without session check
  if (isAuthRoute) {
    return NextResponse.next();
  }

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

  // user-dashboard is for customers and users without vendor context (but super-users can access anything)
  if (isUserDashboardRoute && user.role !== "customer" && !isSuperUser) {
    // Check if user has vendor context by making an internal API call
    try {
      const vendorContextResponse = await fetch(new URL("/api/auth/vendor-context", request.url), {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
      
      if (vendorContextResponse.ok) {
        const vendorContext = await vendorContextResponse.json();
        // If user has vendor context, redirect to main dashboard
        if (vendorContext.vendorId) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
      // If no vendor context or API call fails, allow access to user-dashboard
    } catch (error) {
      // If vendor context check fails, allow access to user-dashboard as fallback
      console.log("[Middleware] Vendor context check failed, allowing user-dashboard access");
    }
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
