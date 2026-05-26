import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { serviceVariants } from "@/lib/db/schema";
import { users } from "@/lib/db/schema";

async function isAdmin(userId: string) {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user[0]?.role === "admin";
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const variants = await db
      .select()
      .from(serviceVariants)
      .where(eq(serviceVariants.serviceId, id))
      .orderBy(serviceVariants.sortOrder);

    console.log(`[GET /api/services/${id}/variants] Found ${variants.length} variants, first:`, variants[0]);

    return NextResponse.json(variants);
  } catch (error) {
    console.error("GET /api/services/[id]/variants error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (!(await isAdmin(session.user.id))) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    console.log("[POST /api/services/[id]/variants] Received body:", body);
    console.log("[POST /api/services/[id]/variants] imageUrl:", body.imageUrl);

    const [variant] = await db
      .insert(serviceVariants)
      .values({
        serviceId: id,
        nameFr: body.nameFr,
        nameEn: body.nameEn,
        priceModifier: body.priceModifier,
        imageUrl: body.imageUrl,
        sortOrder: body.sortOrder ?? 0,
      })
      .returning();

    console.log("[POST /api/services/[id]/variants] Created variant:", variant);

    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    console.error("POST /api/services/[id]/variants error:", error);
    return NextResponse.json({ error: "Erreur lors de la création de la variante" }, { status: 500 });
  }
}
