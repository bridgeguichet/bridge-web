import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { categories, subcategories } from "@/lib/db/schema";

export async function GET() {
  try {
    const allCategories = await db.select().from(categories).orderBy(categories.sortOrder);

    const allSubcategories = await db.select().from(subcategories);

    const result = allCategories.map((cat) => ({
      ...cat,
      subcategories: allSubcategories.filter((sub) => sub.categoryId === cat.id),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
