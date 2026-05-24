import { eq, ne } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const role = searchParams.get("role");

    let result;

    if (role) {
      const roles = role.split(",").map((r) => r.trim());
      if (roles.length === 1) {
        if (roles[0] === "customer") {
          result = await db.select().from(users).where(eq(users.role, "customer")).orderBy(users.createdAt);
        } else {
          result = await db.select().from(users).where(ne(users.role, "customer")).orderBy(users.createdAt);
        }
      } else {
        result = await db.select().from(users).where(ne(users.role, "customer")).orderBy(users.createdAt);
      }
    } else {
      result = await db.select().from(users).orderBy(users.createdAt);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, phone } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nom et email requis" }, { status: 400 });
    }

    const [created] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        name,
        email,
        role: role ?? "staff",
        phone: phone ?? null,
        emailVerified: false,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
