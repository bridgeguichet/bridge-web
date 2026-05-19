"use client";

import { Briefcase, Building, Car, Home, MoreHorizontal, Pencil, Sparkles, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CategoryWithSubcategories } from "@/features/admin";
import { useDeleteCategory } from "@/features/admin";

interface CategoryCardProps {
  category: CategoryWithSubcategories;
  onEdit: (categoryId: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Briefcase: Briefcase,
  Home: Home,
  Building: Building,
  Car: Car,
  Concierge: Sparkles,
};

export function CategoryCard({ category, onEdit }: CategoryCardProps) {
  const deleteCategoryMutation = useDeleteCategory();
  const Icon = iconMap[category.icon || "Briefcase"] || Briefcase;

  const subcategoriesCount = category.subcategories?.length || 0;

  const handleDelete = () => {
    deleteCategoryMutation.mutate(category.id);
  };

  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{category.nameFr}</h3>
            <p className="text-muted-foreground text-sm">{subcategoriesCount} sous-catégorie(s)</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(category.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer la catégorie</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer la catégorie "{category.nameFr}" ?
                    {subcategoriesCount > 0 && (
                      <span className="mt-2 block font-medium text-destructive">
                        Attention : {subcategoriesCount} sous-catégorie(s) seront également supprimées.
                      </span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Slug: {category.slug}</span>
          <span className="text-muted-foreground">Ordre: {category.sortOrder}</span>
        </div>
      </CardContent>
    </Card>
  );
}
