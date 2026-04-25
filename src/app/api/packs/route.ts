import { type NextRequest, NextResponse } from "next/server";

import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { customPacks, packItems } from "@/lib/db/schema";

// GET /api/packs - Liste des packs de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userPacks = await db
      .select()
      .from(customPacks)
      .where(eq(customPacks.userId, session.user.id))
      .orderBy(desc(customPacks.createdAt));

    // Enrichir avec les items
    const packsWithItems = await Promise.all(
      userPacks.map(async (pack) => {
        const items = await db.select().from(packItems).where(eq(packItems.packId, pack.id));

        return {
          ...pack,
          items,
        };
      }),
    );

    return NextResponse.json(packsWithItems);
  } catch (error) {
    console.error("Error fetching packs:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des packs" }, { status: 500 });
  }
}

// POST /api/packs - Créer un nouveau pack
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    // En développement, permettre la création sans auth (pour tests)
    const isDev = process.env.NODE_ENV === "development";
    const userId = session?.user.id || (isDev ? "00000000-0000-0000-0000-000000000000" : null);

    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    const [pack] = await db
      .insert(customPacks)
      .values({
        userId,
        name: name || "Mon Pack Personnalisé",
        status: "draft",
        totalAmount: "0",
        metadata: {
          currentCategoryIndex: 0,
          skippedCategories: [],
          isTemporary: !session, // Marquer comme temporaire si pas de session
        },
      })
      .returning();

    return NextResponse.json({ ...pack, items: [] }, { status: 201 });
  } catch (error) {
    console.error("Error creating pack:", error);
    return NextResponse.json({ error: "Erreur lors de la création du pack" }, { status: 500 });
  }
}
