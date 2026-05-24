import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { serviceVariants } from "@/lib/db/schema";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const variants = await db
      .select()
      .from(serviceVariants)
      .where(eq(serviceVariants.serviceId, id))
      .orderBy(serviceVariants.sortOrder);

    return NextResponse.json(variants);
  } catch (error) {
    console.error("GET /api/services/[id]/variants error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
