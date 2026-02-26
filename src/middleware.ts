import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  // if (!accessToken && refreshToken) {
  //   try {
  //     const baseUrl = request.nextUrl.origin;
  //     const response = await fetch(`${baseUrl}/api/auth/refresh`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Cookie: `refresh_token=${refreshToken.value}`,
  //       },
  //       credentials: "include",
  //     });

  //     if (!response.ok) {
  //       throw new Error("Refresh failed");
  //     }

  //     const contentType = response.headers.get("content-type");
  //     if (!contentType || !contentType.includes("application/json")) {
  //       throw new Error("Invalid response from refresh endpoint");
  //     }

  //     const data = await response.json();
  //     const res = NextResponse.next();

  //     if (data.access_token) {
  //       res.cookies.set("access_token", data.access_token, {
  //         httpOnly: true,
  //         secure: process.env.NODE_ENV === "production",
  //         sameSite: "lax",
  //         maxAge: 60 * 15,
  //         path: "/",
  //       });
  //     }

  //     return res;
  //   } catch (error) {
  //     console.error("Middleware refresh error:", error);
  //     const res = NextResponse.redirect(new URL("/auth/login", request.url));
  //     res.cookies.delete("access_token");
  //     res.cookies.delete("refresh_token");
  //     return res;
  //   }
  // }

  // if (!accessToken && !refreshToken && request.nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
