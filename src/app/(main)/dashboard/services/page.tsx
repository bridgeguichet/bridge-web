"use client";

import { useState } from "react";

import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { useCategories, useCreatePendingAction, useServices, useUserVendorContext } from "@/features/admin";

import { ServiceFormDialog } from "./_components/service-form-dialog";
import { ServiceTable } from "./_components/service-table";
import { VariantDialog } from "./_components/variant-dialog";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [variantServiceId, setVariantServiceId] = useState<string | null>(null);

  const { data: vendorContext } = useUserVendorContext();
  const createPendingAction = useCreatePendingAction();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: services, isLoading: servicesLoading } = useServices({
    categoryId: categoryFilter !== "all" ? categoryFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchQuery || undefined,
  });

  const handleEdit = (serviceId: string) => {
    setEditingServiceId(serviceId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingServiceId(null);
  };

  const handleManageVariants = (serviceId: string) => {
    setVariantServiceId(serviceId);
  };

  const handleRequestDelete = (serviceId: string, serviceName: string) => {
    if (!vendorContext?.vendorId) return;
    createPendingAction.mutate(
      {
        vendorId: vendorContext.vendorId,
        requestedBy: "",
        actionType: "delete",
        targetType: "service",
        targetId: serviceId,
        targetName: serviceName,
        status: "pending",
        reason: null,
        reviewedBy: null,
      },
      {
        onSuccess: () => toast.success("Demande de suppression envoyée à l'administrateur"),
        onError: () => toast.error("Erreur lors de l'envoi de la demande"),
      },
    );
  };

  if (categoriesLoading || servicesLoading) {
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
          <h1 className="font-bold text-3xl tracking-tight">Services</h1>
          <p className="text-muted-foreground">Gérez les services proposés sur la plateforme</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau service
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Rechercher un service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.nameFr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ServiceTable
        services={services || []}
        onEdit={handleEdit}
        onManageVariants={handleManageVariants}
        vendorRole={vendorContext?.role}
        onRequestDelete={handleRequestDelete}
      />

      <ServiceFormDialog open={isFormOpen} onOpenChange={handleCloseForm} serviceId={editingServiceId} />

      <VariantDialog
        open={!!variantServiceId}
        onOpenChange={() => setVariantServiceId(null)}
        serviceId={variantServiceId}
      />
    </div>
  );
}
