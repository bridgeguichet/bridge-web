import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:8000";

export async function POST(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    console.log("refreshToken >>>>>>>>", refreshToken);

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token manquant" }, { status: 401 });
    }

    // console.log("Attempting refresh with URL:", `${API_URL}/api/auth/token/refresh/`);

    const { data } = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
      refresh: refreshToken,
    });

    console.log("data refresh >>>>>>>>", data);

    const { access, refresh } = data;

    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set("access_token", access, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    if (refresh) {
      cookieStore.set("refresh_token", refresh, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        path: "/",
      });
    }

    return NextResponse.json({ success: true, access_token: access }, { status: 200 });
  } catch (error) {
    console.error("Refresh error:", error);

    if (axios.isAxiosError(error)) {
      console.error("Backend response:", error.response?.data);
      console.error("Status code:", error.response?.status);

      if (error.response?.status === 401) {
        cookieStore.delete("access_token");
        cookieStore.delete("refresh_token");
        return NextResponse.json({ error: "Refresh token invalide ou expiré", requireLogin: true }, { status: 401 });
      }
    }

    return NextResponse.json({ error: "Erreur lors du refresh" }, { status: 500 });
  }
}
