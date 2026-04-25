import { type NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  categories,
  services,
  serviceVariants,
  vendors,
} from "@/lib/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await db
      .select({
        service: services,
        category: categories,
        vendor: vendors,
      })
      .from(services)
      .leftJoin(categories, eq(services.categoryId, categories.id))
      .leftJoin(vendors, eq(services.vendorId, vendors.id))
      .where(eq(services.id, id));

    if (!result.length || !result[0].service) {
      return NextResponse.json(
        { error: "Service non trouvé" },
        { status: 404 },
      );
    }

    const variants = await db
      .select()
      .from(serviceVariants)
      .where(eq(serviceVariants.serviceId, id));

    return NextResponse.json({
      ...result[0].service,
      category: result[0].category,
      vendor: result[0].vendor,
      variants,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du service" },
      { status: 500 },
    );
  }
}
