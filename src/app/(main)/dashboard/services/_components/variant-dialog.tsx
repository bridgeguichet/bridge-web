"use client";

import { useState } from "react";

import { ImageIcon, Layers, Plus, Trash2 } from "lucide-react";

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
import { ImageUploader } from "@/components/image-uploader";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ServiceVariant, ServiceWithRelations } from "@/features/admin";
import {
  useCreateServiceVariant,
  useDeleteServiceVariant,
  useServices,
  useServiceVariants,
  useUpdateServiceVariant,
} from "@/features/admin";

interface VariantDialogProps {
  open: boolean;
  onOpenChange: () => void;
  serviceId: string | null;
}

export function VariantDialog({ open, onOpenChange, serviceId }: VariantDialogProps) {
  const { data: services } = useServices();
  const { data: variants } = useServiceVariants(serviceId || "");
  const createVariant = useCreateServiceVariant();
  const updateVariant = useUpdateServiceVariant();
  const deleteVariant = useDeleteServiceVariant();

  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantPrice, setNewVariantPrice] = useState<number>(0);
  const [newVariantImage, setNewVariantImage] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editImage, setEditImage] = useState<string>("");

  const service = serviceId ? services?.find((s: ServiceWithRelations) => s.id === serviceId) : null;
  const variantsList = variants || [];

  const handleAddVariant = () => {
    if (!serviceId || !newVariantName.trim()) return;
    createVariant.mutate(
      {
        serviceId,
        data: {
          nameFr: newVariantName.trim(),
          nameEn: newVariantName.trim(),
          priceModifier: String(newVariantPrice),
          sortOrder: variantsList.length,
          imageUrl: newVariantImage || undefined,
        },
      },
      {
        onSuccess: () => {
          setNewVariantName("");
          setNewVariantPrice(0);
          setNewVariantImage("");
        },
      }
    );
  };

  const handleStartEdit = (variantId: string) => {
    const variant = variantsList.find((v: ServiceVariant) => v.id === variantId);
    if (variant) {
      setEditingId(variantId);
      setEditName(variant.nameFr);
      setEditPrice(Number(variant.priceModifier));
      setEditImage(variant.imageUrl || "");
    }
  };

  const handleSaveEdit = () => {
    if (!editingId || !editName.trim()) return;
    updateVariant.mutate(
      {
        id: editingId,
        data: {
          nameFr: editName.trim(),
          nameEn: editName.trim(),
          priceModifier: String(editPrice),
          imageUrl: editImage || undefined,
        },
      },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditName("");
          setEditPrice(0);
          setEditImage("");
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice(0);
    setEditImage("");
  };

  const handleDelete = (variantId: string) => {
    deleteVariant.mutate(variantId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Variantes du service</DialogTitle>
              <DialogDescription>{service?.nameFr || "Service"}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="mb-3 font-medium text-sm">Ajouter une variante</h4>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Nom de la variante"
                    value={newVariantName}
                    onChange={(e) => setNewVariantName(e.target.value)}
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    placeholder="Prix"
                    min="0"
                    step="0.01"
                    value={newVariantPrice}
                    onChange={(e) => setNewVariantPrice(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <Button onClick={handleAddVariant} size="icon" disabled={!newVariantName.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground text-xs">Image (optionnel)</label>
                <ImageUploader
                  value={newVariantImage}
                  onChange={setNewVariantImage}
                  onRemove={() => setNewVariantImage("")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Variantes existantes ({variantsList.length})</Label>
            {variantsList.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-muted-foreground text-sm">Aucune variante pour ce service</p>
              </div>
            ) : (
              <div className="space-y-2">
                {variantsList.map((variant: ServiceVariant) => (
                  <div key={variant.id} className="flex items-center gap-2 rounded-lg border bg-card p-3">
                    {editingId === variant.id ? (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex gap-2">
                          <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1" />
                          <Input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                            className="w-24"
                          />
                          <Button size="sm" onClick={handleSaveEdit}>
                            OK
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                            ✕
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <label className="text-muted-foreground text-xs">Image (optionnel)</label>
                          <ImageUploader value={editImage} onChange={setEditImage} onRemove={() => setEditImage("")} />
                        </div>
                      </div>
                    ) : (
                      <>
                        {variant.imageUrl ? (
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md">
                            <img src={variant.imageUrl} alt="" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="flex-1 font-medium">{variant.nameFr}</span>
                        <span className="text-muted-foreground">{variant.priceModifier} USD</span>
                        <Button size="sm" variant="ghost" onClick={() => handleStartEdit(variant.id)}>
                          Modifier
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer la variante</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer la variante "{variant.nameFr}" ?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(variant.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
