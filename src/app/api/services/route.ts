import { type NextRequest, NextResponse } from "next/server";

import { and, eq, like, or } from "drizzle-orm";

import { db } from "@/lib/db";
import { categories, services, vendors } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "active";

    const conditions = [eq(services.status, status)];

    if (categoryId) {
      conditions.push(eq(services.categoryId, categoryId));
    }

    if (search) {
      conditions.push(or(like(services.nameFr, `%${search}%`), like(services.nameEn, `%${search}%`))!);
    }

    const result = await db
      .select({
        service: services,
        category: categories,
        vendor: vendors,
      })
      .from(services)
      .leftJoin(categories, eq(services.categoryId, categories.id))
      .leftJoin(vendors, eq(services.vendorId, vendors.id))
      .where(and(...conditions));

    const formattedServices = result.map((row) => ({
      ...row.service,
      category: row.category,
      vendor: row.vendor,
    }));

    return NextResponse.json(formattedServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des services" }, { status: 500 });
  }
}
