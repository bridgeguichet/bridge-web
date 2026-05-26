"use client";

import { useEffect, useState } from "react";

import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/image-uploader";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Service, ServiceWithRelations, Category } from "@/features/admin";
import { useCategories, useCreateService, useServices, useUpdateService } from "@/features/admin";

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: () => void;
  serviceId: string | null;
}

interface FormData {
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  categoryId: string;
  basePrice: number;
  priceUnit: string;
  status: string;
  isTemporary: boolean;
  expiresAt: string;
  imageUrl: string;
}

const initialFormData: FormData = {
  nameFr: "",
  nameEn: "",
  descriptionFr: "",
  descriptionEn: "",
  categoryId: "",
  basePrice: 0,
  priceUnit: "unit",
  status: "active",
  isTemporary: false,
  expiresAt: "",
  imageUrl: "",
};

export function ServiceFormDialog({ open, onOpenChange, serviceId }: ServiceFormDialogProps) {
  const { data: services } = useServices();
  const { data: categories } = useCategories();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const isEditing = !!serviceId;
  const editingService = serviceId ? services?.find((s: ServiceWithRelations) => s.id === serviceId) : null;

  useEffect(() => {
    if (editingService) {
      setFormData({
        nameFr: editingService.nameFr,
        nameEn: editingService.nameEn,
        descriptionFr: editingService.descriptionFr || "",
        descriptionEn: editingService.descriptionEn || "",
        categoryId: editingService.categoryId,
        basePrice: Number(editingService.basePrice),
        priceUnit: editingService.priceUnit,
        status: editingService.status,
        isTemporary: !!editingService.expiresAt,
        expiresAt: editingService.expiresAt ? new Date(editingService.expiresAt).toISOString().split("T")[0] : "",
        imageUrl: editingService.imageUrl || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingService, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      basePrice: String(formData.basePrice),
      expiresAt: formData.isTemporary && formData.expiresAt ? new Date(formData.expiresAt) : null,
    };
    if (isEditing && serviceId) {
      updateService.mutate({ id: serviceId, data: submitData });
    } else {
      createService.mutate(submitData as any);
    }
    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{isEditing ? "Modifier le service" : "Nouveau service"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Modifiez les informations du service"
                  : "Remplissez les informations pour créer un nouveau service"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nameFr">
                  Nom (FR) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nameFr"
                  placeholder="Ex: Chauffeur privé"
                  value={formData.nameFr}
                  onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameEn">
                  Nom (EN) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nameEn"
                  placeholder="Ex: Private Driver"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="descriptionFr">Description (FR)</Label>
                <Textarea
                  id="descriptionFr"
                  placeholder="Décrivez le service..."
                  value={formData.descriptionFr}
                  onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEn">Description (EN)</Label>
                <Textarea
                  id="descriptionEn"
                  placeholder="Describe the service..."
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Catégorie <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nameFr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="basePrice">
                  Prix de base (USD) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceUnit">Unité de prix</Label>
                <Select
                  value={formData.priceUnit}
                  onValueChange={(value) => setFormData({ ...formData, priceUnit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hour">Par heure</SelectItem>
                    <SelectItem value="day">Par jour</SelectItem>
                    <SelectItem value="month">Par mois</SelectItem>
                    <SelectItem value="unit">Par unité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="status">Service actif</Label>
                  <p className="text-muted-foreground text-sm">Le service sera visible sur la plateforme</p>
                </div>
                <Switch
                  id="status"
                  checked={formData.status === "active"}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "active" : "draft" })}
                />
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isTemporary">Service temporaire</Label>
                  <p className="text-muted-foreground text-sm">
                    Le service expirera automatiquement à la date spécifiée
                  </p>
                </div>
                <Switch
                  id="isTemporary"
                  checked={formData.isTemporary}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isTemporary: checked, expiresAt: checked ? "" : "" })
                  }
                />
              </div>
            </div>

            {formData.isTemporary && (
              <div className="space-y-2">
                <Label htmlFor="expiresAt">
                  Date d'expiration <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required={formData.isTemporary}
                />
                <p className="text-muted-foreground text-xs">
                  Le service sera automatiquement archivé après cette date
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUploader
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                onRemove={() => setFormData({ ...formData, imageUrl: "" })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onOpenChange}>
              Annuler
            </Button>
            <Button type="submit">{isEditing ? "Enregistrer" : "Créer le service"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
