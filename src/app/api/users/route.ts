import { type NextRequest, NextResponse } from "next/server";

import { and, eq, like, or } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  try {
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
  }
}
