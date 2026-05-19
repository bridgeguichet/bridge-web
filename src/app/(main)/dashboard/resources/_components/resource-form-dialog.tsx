"use client";

import { useEffect, useState } from "react";

import { Box } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import type { Resource } from "@/features/admin";
import { useCreateResource, useResources, useUpdateResource } from "@/features/admin";

interface ResourceFormDialogProps {
  open: boolean;
  onOpenChange: () => void;
  resourceId: string | null;
}

interface FormData {
  name: string;
  type: string;
  status: string;
  vendorId: string;
  metadata: Record<string, unknown>;
}

const initialFormData: FormData = {
  name: "",
  type: "staff",
  status: "available",
  vendorId: "",
  metadata: {},
};

export function ResourceFormDialog({ open, onOpenChange, resourceId }: ResourceFormDialogProps) {
  const { data: resources } = useResources();
  const createResource = useCreateResource();
  const updateResource = useUpdateResource();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [metadataKey, setMetadataKey] = useState("");
  const [metadataValue, setMetadataValue] = useState("");

  const isEditing = !!resourceId;
  const editingResource = resourceId ? resources?.find((r: Resource) => r.id === resourceId) : null;

  useEffect(() => {
    if (editingResource) {
      setFormData({
        name: editingResource.name,
        type: editingResource.type,
        status: editingResource.status,
        vendorId: editingResource.vendorId,
        metadata: (editingResource.metadata as Record<string, unknown>) || {},
      });
    } else {
      setFormData(initialFormData);
    }
    setMetadataKey("");
    setMetadataValue("");
  }, [editingResource, open]);

  const handleAddMetadata = () => {
    if (!metadataKey.trim()) return;
    setFormData({
      ...formData,
      metadata: {
        ...formData.metadata,
        [metadataKey.trim()]: metadataValue.trim(),
      },
    });
    setMetadataKey("");
    setMetadataValue("");
  };

  const handleRemoveMetadata = (key: string) => {
    const newMetadata = { ...formData.metadata };
    delete newMetadata[key];
    setFormData({ ...formData, metadata: newMetadata });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && resourceId) {
      updateResource.mutate({ id: resourceId, data: formData });
    } else {
      createResource.mutate(formData);
    }
    onOpenChange();
  };

  const metadataEntries = Object.entries((formData.metadata as Record<string, unknown>) || {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Box className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>{isEditing ? "Modifier la ressource" : "Nouvelle ressource"}</DialogTitle>
              <DialogDescription>
                {isEditing ? "Modifiez les informations de la ressource" : "Ajoutez une nouvelle ressource au système"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nom de la ressource <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ex: Jean-Pierre Mukendi"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type de ressource</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "driver" | "vehicle" | "staff") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver">Chauffeur</SelectItem>
                  <SelectItem value="vehicle">Véhicule</SelectItem>
                  <SelectItem value="staff">Personnel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Statut</Label>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                <Switch
                  checked={formData.status === "available"}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked ? "available" : "unavailable" })
                  }
                />
                <span className="text-sm">{formData.status === "available" ? "Disponible" : "Non disponible"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Informations supplémentaires</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Clé (ex: phone)"
                value={metadataKey}
                onChange={(e) => setMetadataKey(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Valeur"
                value={metadataValue}
                onChange={(e) => setMetadataValue(e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleAddMetadata}>
                +
              </Button>
            </div>
            {metadataEntries.length > 0 && (
              <div className="mt-2 space-y-1">
                {metadataEntries.map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between rounded bg-muted/50 px-3 py-1.5 text-sm">
                    <span>
                      <strong>{key}:</strong> {String(value)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveMetadata(key)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onOpenChange}>
              Annuler
            </Button>
            <Button type="submit">{isEditing ? "Enregistrer" : "Créer la ressource"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
