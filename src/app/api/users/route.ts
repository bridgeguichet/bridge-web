<<<<<<< HEAD
import { type NextRequest, NextResponse } from "next/server";

import { and, eq, like, or } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
=======
import { eq, ne } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

>>>>>>> backup-plan
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  try {
<<<<<<< HEAD
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const conditions = [];

    if (role) {
      conditions.push(eq(users.role, role));
    }

    if (search) {
      conditions.push(or(like(users.name, `%${search}%`), like(users.email, `%${search}%`))!);
    }

    const result =
      conditions.length > 0
        ? await db
            .select()
            .from(users)
            .where(and(...conditions))
            .orderBy(users.createdAt)
        : await db.select().from(users).orderBy(users.createdAt);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des utilisateurs" }, { status: 500 });
=======
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
>>>>>>> backup-plan
  }
}
