"use client";

import { CheckCircle2, Eye, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PendingAction } from "@/lib/db/schema";

interface ActionWithRequester {
  action: PendingAction;
  requester: {
    id: string;
    email: string;
    name: string;
  };
}

interface PendingActionsTableProps {
  actions: ActionWithRequester[];
  statusLabels: Record<string, { label: string; icon: React.ReactNode; color: string }>;
  actionTypeLabels: Record<string, string>;
  isAdmin: boolean;
  onReview: (id: string, status: "approved" | "rejected") => void;
}

export function PendingActionsTable({
  actions,
  statusLabels,
  actionTypeLabels,
  isAdmin,
  onReview,
}: PendingActionsTableProps) {
  const getStatusBadge = (status: string) => {
    const config = statusLabels[status] || { label: status, color: "bg-gray-100 text-gray-600" };
    return (
      <Badge className={`${config.color} border-0`}>
        <span className="flex items-center gap-1">
          {config.icon}
          {config.label}
        </span>
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type d&apos;action</TableHead>
            <TableHead>Cible</TableHead>
            <TableHead>Demandeur</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            {isAdmin && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions.map((item) => (
            <TableRow key={item.action.id}>
              <TableCell>
                <span className="font-medium">
                  {actionTypeLabels[item.action.actionType] || item.action.actionType}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground text-sm capitalize">{item.action.targetType}</span>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{item.requester.name}</p>
                  <p className="text-muted-foreground text-xs">{item.requester.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground text-sm">
                  {new Date(item.action.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </TableCell>
              <TableCell>{getStatusBadge(item.action.status)}</TableCell>
              {isAdmin && item.action.status === "pending" && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => onReview(item.action.id, "approved")}
                    >
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Approuver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onReview(item.action.id, "rejected")}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Rejeter
                    </Button>
                  </div>
                </TableCell>
              )}
              {isAdmin && item.action.status !== "pending" && (
                <TableCell className="text-right">
                  <span className="text-muted-foreground text-sm">
                    {item.action.reviewedAt
                      ? `Traité le ${new Date(item.action.reviewedAt).toLocaleDateString("fr-FR")}`
                      : "Traité"}
                  </span>
                </TableCell>
              )}
              {!isAdmin && (
                <TableCell className="text-right">
                  <span className="text-muted-foreground text-sm">
                    {item.action.status === "pending" && "En attente de validation"}
                    {item.action.status === "approved" && "Approuvé par l'admin"}
                    {item.action.status === "rejected" && "Rejeté par l'admin"}
                  </span>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
