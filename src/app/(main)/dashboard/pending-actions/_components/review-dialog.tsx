"use client";

import { useState } from "react";

import { CheckCircle2, Loader2, XCircle, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PendingAction } from "@/lib/db/schema";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionId: string;
  actionStatus: "approved" | "rejected";
  action: PendingAction | undefined;
  onConfirm: (id: string, status: "approved" | "rejected", reason?: string) => void;
  isSubmitting: boolean;
}

export function ReviewDialog({
  open,
  onOpenChange,
  actionId,
  actionStatus,
  action,
  onConfirm,
  isSubmitting,
}: ReviewDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(actionId, actionStatus, reason.trim() || undefined);
  };

  const isApprove = actionStatus === "approved";
  const actionTypeLabels: Record<string, string> = {
    delete_service: "Suppression de service",
    delete_category: "Suppression de catégorie",
    delete_variant: "Suppression de variante",
    delete_resource: "Suppression de ressource",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Approuver la demande
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                Rejeter la demande
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isApprove
              ? "L'action sera exécutée immédiatement après approbation."
              : "La demande sera rejetée et l'action ne sera pas exécutée."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Action details */}
          {action && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type :</span>
                <span className="font-medium">{actionTypeLabels[action.actionType] || action.actionType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cible :</span>
                <span className="font-medium capitalize">{action.targetType}</span>
              </div>
              {action.reason && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Motif de la demande :</span>
                  <p className="mt-1 text-sm italic">"{action.reason}"</p>
                </div>
              )}
            </div>
          )}

          {/* Warning for approval */}
          {isApprove && (
            <div className="flex items-start gap-2 rounded-md bg-yellow-50 p-3 text-yellow-800 text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                Attention : L&apos;approbation exécutera définitivement l&apos;action demandée (ex: suppression de
                service). Cette opération est irréversible.
              </p>
            </div>
          )}

          {/* Reason input */}
          <div className="grid gap-2">
            <Label htmlFor="reason">{isApprove ? "Commentaire (optionnel)" : "Motif du rejet (optionnel)"}</Label>
            <Textarea
              id="reason"
              placeholder={isApprove ? "Ajoutez un commentaire..." : "Expliquez pourquoi vous rejetez cette demande..."}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            variant={isApprove ? "default" : "destructive"}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isApprove ? "Confirmer l'approbation" : "Confirmer le rejet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
