import { type NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { serviceVariants } from "@/lib/db/schema/services";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const variants = await db
      .select()
      .from(serviceVariants)
      .where(eq(serviceVariants.serviceId, id))
      .orderBy(serviceVariants.sortOrder);

    return NextResponse.json(variants);
  } catch (error) {
    console.error("Error fetching service variants:", error);
    return NextResponse.json({ error: "Failed to fetch service variants" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id: serviceId } = await params;
    const body = await request.json();

    const [variant] = await db
      .insert(serviceVariants)
      .values({ ...body, serviceId })
      .returning();

    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    console.error("Error creating service variant:", error);
    return NextResponse.json({ error: "Erreur lors de la création de la variante" }, { status: 500 });
  }
}
