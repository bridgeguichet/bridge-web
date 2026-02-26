import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:8000";

export async function POST(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken) {
      await axios
        .post(`${API_URL}/api/auth/logout/`, {
          refresh_token: refreshToken,
        })
        .catch((error) => {
          console.error("Django logout error:", error);
        });
    }

    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 });
  }
}
