import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { canPerform } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { categories, subcategories, users } from "@/lib/db/schema";

// Helper to get current user from session
async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

// Helper to check if user is admin (for global categories)
async function isAdmin(userId: string) {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user[0]?.role === "admin";
}

export async function GET() {
  try {
    console.log("GET /api/categories - fetching from db...");
    const allCategories = await db.select().from(categories).orderBy(categories.sortOrder);
    console.log("GET /api/categories - categories fetched:", allCategories.length);

    const allSubcategories = await db.select().from(subcategories);
    console.log("GET /api/categories - subcategories fetched:", allSubcategories.length);

    const result = allCategories.map((cat) => ({
      ...cat,
      subcategories: allSubcategories.filter((sub) => sub.categoryId === cat.id),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Categories are global - only admin can create
    if (!(await isAdmin(user.id))) {
      return NextResponse.json({ error: "Permission refusée - Admin requis" }, { status: 403 });
    }

    const body = await request.json();
    const { slug, nameFr, nameEn, icon, sortOrder } = body;

    if (!slug || !nameFr || !nameEn) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const [newCategory] = await db
      .insert(categories)
      .values({
        slug,
        nameFr,
        nameEn,
        icon,
        sortOrder: sortOrder ?? 0,
      })
      .returning();

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
