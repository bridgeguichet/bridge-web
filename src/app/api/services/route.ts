import { type NextRequest, NextResponse } from "next/server";

import { and, eq, like, or } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { categories, serviceVariants, services, vendors } from "@/lib/db/schema";

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
        variant: serviceVariants,
      })
      .from(services)
      .leftJoin(categories, eq(services.categoryId, categories.id))
      .leftJoin(vendors, eq(services.vendorId, vendors.id))
      .leftJoin(serviceVariants, eq(services.id, serviceVariants.serviceId))
      .where(and(...conditions));

    // Grouper les variantes par service
    const servicesMap = new Map();
    result.forEach((row) => {
      if (!servicesMap.has(row.service.id)) {
        servicesMap.set(row.service.id, {
          ...row.service,
          category: row.category,
          vendor: row.vendor,
          variants: [],
        });
      }
      if (row.variant) {
        servicesMap.get(row.service.id).variants.push(row.variant);
      }
    });

    const formattedServices = Array.from(servicesMap.values());

    return NextResponse.json(formattedServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des services" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const [service] = await db.insert(services).values(body).returning();

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: "Erreur lors de la création du service" }, { status: 500 });
  }
}
