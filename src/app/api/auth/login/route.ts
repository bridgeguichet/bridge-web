import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const { data } = await axios.post(`${API_URL}/api/auth/login/`, {
      email,
      password,
    });

    const { access, refresh } = data;

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set("access_token", access, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    cookieStore.set("refresh_token", refresh, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    const { data: userData } = await axios.get(`${API_URL}/api/auth/profile/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: userData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la connexion" }, { status: 500 });
  }
}
