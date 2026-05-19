"use client";

import { useState } from "react";

import { Box, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useResources } from "@/features/admin";

import { ResourceFormDialog } from "./_components/resource-form-dialog";
import { ResourceTable } from "./_components/resource-table";

export default function ResourcesPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);

  const { data: resources, isLoading } = useResources({
    type: typeFilter !== "all" ? typeFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const handleEdit = (resourceId: string) => {
    setEditingResourceId(resourceId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingResourceId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Ressources</h1>
          <p className="text-muted-foreground">Gérez les ressources disponibles (chauffeurs, véhicules, personnel)</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle ressource
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="driver">Chauffeurs</SelectItem>
            <SelectItem value="vehicle">Véhicules</SelectItem>
            <SelectItem value="staff">Personnel</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="unavailable">Non disponible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !resources || resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-12 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Box className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold text-lg">Aucune ressource trouvée</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            {typeFilter !== "all" || statusFilter !== "all"
              ? "Essayez de modifier vos filtres."
              : "Commencez par créer votre première ressource."}
          </p>
        </div>
      ) : (
        <ResourceTable resources={resources} onEdit={handleEdit} />
      )}

      <ResourceFormDialog open={isFormOpen} onOpenChange={handleCloseForm} resourceId={editingResourceId} />
    </div>
  );
}
