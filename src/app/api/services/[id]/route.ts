import { type NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { services, serviceVariants } from "@/lib/db/schema";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [service] = await db.select().from(services).where(eq(services.id, id));

    if (!service) {
      return NextResponse.json({ error: "Service non trouvé" }, { status: 404 });
    }

    const variants = await db.select().from(serviceVariants).where(eq(serviceVariants.serviceId, id));

    return NextResponse.json({ ...service, variants });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération du service" }, { status: 500 });
  }
}
