import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

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
      })
    );

    return NextResponse.json(categoriesWithSubs);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des catégories" }, { status: 500 });
  }
}
