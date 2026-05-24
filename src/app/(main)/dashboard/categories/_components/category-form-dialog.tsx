"use client";

import { useEffect, useState } from "react";

import { Tags } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NewCategory } from "@/features/admin";
import { useCategories, useCreateCategory, useUpdateCategory } from "@/features/admin";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: () => void;
  categoryId: string | null;
}

interface FormData {
  nameFr: string;
  nameEn: string;
  slug: string;
  icon: string;
  sortOrder: number;
}

const iconOptions = [
  { value: "Briefcase", label: "Services" },
  { value: "Home", label: "Maison" },
  { value: "Building", label: "Logement" },
  { value: "Car", label: "Mobilité" },
  { value: "Concierge", label: "Conciergerie" },
];

const initialFormData: FormData = {
  nameFr: "",
  nameEn: "",
  slug: "",
  icon: "Briefcase",
  sortOrder: 0,
};

export function CategoryFormDialog({ open, onOpenChange, categoryId }: CategoryFormDialogProps) {
  const { data: categories } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const isEditing = !!categoryId;
  const editingCategory = categoryId ? categories?.find((c) => c.id === categoryId) : null;

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        nameFr: editingCategory.nameFr,
        nameEn: editingCategory.nameEn,
        slug: editingCategory.slug,
        icon: editingCategory.icon || "Briefcase",
        sortOrder: editingCategory.sortOrder,
      });
    } else {
      setFormData({
        ...initialFormData,
        sortOrder: (categories?.length || 0) + 1,
      });
    }
  }, [editingCategory, categories?.length, open]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (nameFr: string) => {
    setFormData({
      ...formData,
      nameFr,
      slug: isEditing ? formData.slug : generateSlug(nameFr),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && categoryId) {
      updateCategory.mutate({ id: categoryId, data: formData });
    } else {
      createCategory.mutate(formData as Omit<NewCategory, "id">);
    }
    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Tags className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{isEditing ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Modifiez les informations de la catégorie" : "Créez une nouvelle catégorie de services"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nameFr">
              Nom (FR) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nameFr"
              placeholder="Ex: Personnel de Maison"
              value={formData.nameFr}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameEn">
              Nom (EN) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nameEn"
              placeholder="Ex: Household Staff"
              value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="personnel-maison"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
            <p className="text-muted-foreground text-xs">Identifiant unique utilisé dans les URLs</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="icon">Icône</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Ordre d'affichage</Label>
              <Input
                id="sortOrder"
                type="number"
                min="0"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onOpenChange}>
              Annuler
            </Button>
            <Button type="submit">{isEditing ? "Enregistrer" : "Créer la catégorie"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
