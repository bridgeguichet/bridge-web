import { and, eq, ilike, inArray, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { categories, serviceVariants, services, vendors } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const categoryId = searchParams.get("categoryId");
    const subcategoryId = searchParams.get("subcategoryId");
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "active";

    const conditions = [eq(services.status, status)];

    if (categoryId) conditions.push(eq(services.categoryId, categoryId));
    if (subcategoryId) conditions.push(eq(services.subcategoryId, subcategoryId));
    if (search) {
      conditions.push(
        or(
          ilike(services.nameFr, `%${search}%`),
          ilike(services.nameEn, `%${search}%`),
          ilike(services.descriptionFr, `%${search}%`),
        )!,
      );
    }

    const rows = await db
      .select()
      .from(services)
      .leftJoin(categories, eq(services.categoryId, categories.id))
      .leftJoin(vendors, eq(services.vendorId, vendors.id))
      .where(and(...conditions));

    const serviceIds = rows.map((r) => r.services.id);
    const variants =
      serviceIds.length > 0
        ? await db.select().from(serviceVariants).where(inArray(serviceVariants.serviceId, serviceIds))
        : [];

    const result = rows.map((row) => ({
      ...row.services,
      category: row.categories ?? undefined,
      vendor: row.vendors ?? undefined,
      variants: variants.filter((v) => v.serviceId === row.services.id),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
