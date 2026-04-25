import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:8000";

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { data } = await axios.get(`${API_URL}/api/auth/profile/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("Profile error:", error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
