"use client";

import { useState } from "react";

import { Loader2, Plus, Tags } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCategories } from "@/features/admin";

import { CategoryCard } from "./_components/category-card";
import { CategoryFormDialog } from "./_components/category-form-dialog";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const handleEdit = (categoryId: string) => {
    setEditingCategoryId(categoryId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategoryId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Catégories</h1>
          <p className="text-muted-foreground">Gérez les catégories de services</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle catégorie
        </Button>
      </div>

      {!categories || categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-12 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Tags className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold text-lg">Aucune catégorie</h3>
          <p className="mt-1 text-muted-foreground text-sm">Commencez par créer votre première catégorie.</p>
          <Button onClick={() => setIsFormOpen(true)} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Créer une catégorie
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <CategoryFormDialog open={isFormOpen} onOpenChange={handleCloseForm} categoryId={editingCategoryId} />
    </div>
  );
}
