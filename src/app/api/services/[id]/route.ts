import { eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { categories, serviceVariants, services, vendors } from "@/lib/db/schema";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const rows = await db
      .select()
      .from(services)
      .leftJoin(categories, eq(services.categoryId, categories.id))
      .leftJoin(vendors, eq(services.vendorId, vendors.id))
      .where(eq(services.id, id));

    if (rows.length === 0) {
      return NextResponse.json({ error: "Service introuvable" }, { status: 404 });
    }

    const row = rows[0];
    const variants = await db
      .select()
      .from(serviceVariants)
      .where(eq(serviceVariants.serviceId, id));

    return NextResponse.json({
      ...row.services,
      category: row.categories ?? undefined,
      vendor: row.vendors ?? undefined,
      variants,
    });
  } catch (error) {
    console.error("GET /api/services/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
