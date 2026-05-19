import { type NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { categories, subcategories } from "@/lib/db/schema";

export async function GET() {
  try {
    const allCategories = await db.select().from(categories).orderBy(categories.sortOrder);

    const categoriesWithSubs = await Promise.all(
      allCategories.map(async (category) => {
        const subs = await db.select().from(subcategories).where(eq(subcategories.categoryId, category.id));

        return {
          ...category,
          subcategories: subs,
        };
      }),
    );

    return NextResponse.json(categoriesWithSubs);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des catégories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const [category] = await db.insert(categories).values(body).returning();

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Erreur lors de la création de la catégorie" }, { status: 500 });
  }
}
