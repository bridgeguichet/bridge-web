import { type NextRequest, NextResponse } from "next/server";

import { and, eq, like, or } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  categories,
  serviceVariants,
  services,
  vendors,
} from "@/lib/db/schema";

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
      conditions.push(
        or(
          like(services.nameFr, `%${search}%`),
          like(services.nameEn, `%${search}%`),
        )!,
      );
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

    // Récupérer les variants pour tous les services
    const serviceIds = result.map((row) => row.service.id);
    const allVariants =
      serviceIds.length > 0
        ? await db
            .select()
            .from(serviceVariants)
            .where(eq(serviceVariants.serviceId, serviceIds[0]))
        : [];

    // Grouper les variants par serviceId
    const variantsByService: Record<string, typeof allVariants> = {};
    for (const serviceId of serviceIds) {
      const variants = await db
        .select()
        .from(serviceVariants)
        .where(eq(serviceVariants.serviceId, serviceId));
      variantsByService[serviceId] = variants;
    }

    const formattedServices = result.map((row) => ({
      ...row.service,
      category: row.category,
      vendor: row.vendor,
      variants: variantsByService[row.service.id] || [],
    }));

    return NextResponse.json(formattedServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des services" },
      { status: 500 },
    );
  }
}
