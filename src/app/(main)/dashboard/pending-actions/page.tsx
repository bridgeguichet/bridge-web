"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { CheckCircle2, Clock, Loader2, RefreshCw, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePendingActions, usePendingActionsStats, useReviewPendingAction, useUserVendorContext } from "@/features/admin";
import { useAuthStore } from "@/features/auth/store";

import { PendingActionsTable } from "./_components/pending-actions-table";
import { ReviewDialog } from "./_components/review-dialog";

const STATUS_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: "En attente", icon: <Clock className="h-4 w-4" />, color: "text-yellow-600 bg-yellow-100" },
  approved: { label: "Approuvé", icon: <CheckCircle2 className="h-4 w-4" />, color: "text-green-600 bg-green-100" },
  rejected: { label: "Rejeté", icon: <XCircle className="h-4 w-4" />, color: "text-red-600 bg-red-100" },
};

const ACTION_TYPE_LABELS: Record<string, string> = {
  delete_service: "Suppression de service",
  delete_category: "Suppression de catégorie",
  delete_variant: "Suppression de variante",
  delete_resource: "Suppression de ressource",
  delete_member: "Suppression de membre",
};

export default function PendingActionsPage() {
  const { currentUser: user } = useAuthStore();
  const { data: vendorContext } = useUserVendorContext();
  const vendorId = vendorContext?.vendorId || "";
  const isAdmin = user?.role === "admin";

  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewingAction, setReviewingAction] = useState<{ id: string; status: "approved" | "rejected" } | null>(null);

  const { data: actions, isLoading, refetch } = usePendingActions(vendorId, statusFilter);
  const { data: stats } = usePendingActionsStats(vendorId);
  const reviewAction = useReviewPendingAction();
  const isReviewing = reviewAction.isPending;

  // Logs pour déboguer
  console.log(`🔄 Pending Actions Page - vendorId: ${vendorId}, statusFilter: ${statusFilter}, actions count: ${actions?.length || 0}`);
  console.log(`📊 Stats:`, stats);
  console.log(`📋 Actions:`, actions?.map(a => ({ id: a.action.id, status: a.action.status, targetType: a.action.targetType })));

  const filteredActions = useMemo(() => {
    if (!actions) return [];
    if (!searchQuery) return actions;
    return actions.filter((a) => {
      const matchesSearch =
        a.action.targetType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ACTION_TYPE_LABELS[a.action.actionType]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.requester.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [actions, searchQuery]);

  const handleReview = async (id: string, status: "approved" | "rejected", reason?: string) => {
    try {
      await reviewAction.mutateAsync({ id, vendorId, status, reason });
      setReviewingAction(null);
      
      // Afficher une notification de succès
      toast.success(
        status === "approved" 
          ? "Action approuvée avec succès" 
          : "Action rejetée avec succès"
      );
      
      // Basculer automatiquement vers l'onglet correspondant après validation
      setTimeout(() => {
        setStatusFilter(status);
        // Forcer un rafraîchissement après le changement de filtre
        setTimeout(() => {
          refetch();
        }, 50);
      }, 100);
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      toast.error("Erreur lors de la validation");
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Données actualisées");
  };

  const handleCloseReview = () => {
    setReviewingAction(null);
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
          <h1 className="font-bold text-3xl tracking-tight">Actions en attente</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Validez ou refusez les demandes de votre équipe" : "Suivez vos demandes de validation"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Rechercher par type ou demandeur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Approuvées</SelectItem>
            <SelectItem value="rejected">Rejetées</SelectItem>
            <SelectItem value="all">Toutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Object.entries(STATUS_LABELS).map(([status, { label, icon, color }]) => {
          const count = stats?.[status as keyof typeof stats] ?? 0;
          const isSelected = statusFilter === status;
          return (
            <Button
              key={status}
              variant={isSelected ? "default" : "outline"}
              className="justify-start gap-3 h-auto py-3"
              onClick={() => setStatusFilter(status)}
            >
              <div className={`rounded-full p-2 ${color}`}>{icon}</div>
              <div className="text-left">
                <p className="font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">
                  {count} demande{count !== 1 ? "s" : ""}
                </p>
              </div>
            </Button>
          );
        })}
      </div>

      {filteredActions.length === 0 && !isReviewing ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-12 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold text-lg">
            {isReviewing ? "Traitement en cours..." : "Aucune action en attente"}
          </h3>
          <p className="mt-1 text-muted-foreground text-sm">
            {isReviewing
              ? "Veuillez patienter pendant le traitement de votre demande."
              : searchQuery
                ? "Essayez une autre recherche."
                : statusFilter === "pending"
                  ? "Votre équipe n'a soumis aucune demande récemment."
                  : "Aucune action dans cette catégorie."}
          </p>
        </div>
      ) : (
        <PendingActionsTable
          actions={filteredActions}
          statusLabels={STATUS_LABELS}
          actionTypeLabels={ACTION_TYPE_LABELS}
          isAdmin={isAdmin}
          disabled={isReviewing}
          onReview={(id: string, status: "approved" | "rejected") => setReviewingAction({ id, status })}
        />
      )}

      {reviewingAction && (
        <ReviewDialog
          open={!!reviewingAction}
          onOpenChange={handleCloseReview}
          actionId={reviewingAction.id}
          actionStatus={reviewingAction.status}
          action={actions?.find((a) => a.action.id === reviewingAction.id)?.action}
          onConfirm={handleReview}
          isSubmitting={reviewAction.isPending}
        />
      )}
    </div>
  );
}
