import { type NextRequest, NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { resources } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const conditions = [];
    if (type) {
      conditions.push(eq(resources.type, type));
    }
    if (status) {
      conditions.push(eq(resources.status, status));
    }

    const result =
      conditions.length > 0
        ? await db
            .select()
            .from(resources)
            .where(and(...conditions))
        : await db.select().from(resources);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des ressources" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const [resource] = await db.insert(resources).values(body).returning();

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json({ error: "Erreur lors de la création de la ressource" }, { status: 500 });
  }
}
