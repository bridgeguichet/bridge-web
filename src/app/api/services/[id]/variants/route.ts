import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { serviceVariants } from "@/lib/db/schema/services";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

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
