"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Transaction } from "@/features/transactions/types";

interface RecentOrdersProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  completed: { label: "Payée", variant: "default" },
  pending: { label: "En préparation", variant: "secondary" },
  failed: { label: "Échouée", variant: "destructive" },
  refunded: { label: "Remboursée", variant: "outline" },
};

export function RecentOrders({ transactions, isLoading }: RecentOrdersProps) {
  const recent = transactions.slice(0, 5);

  return (
    <Card className="border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-semibold text-base">Commandes récentes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[140px]">N° commande</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="w-[80px]">Articles</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="w-[120px]">Statut</TableHead>
                  <TableHead className="w-[100px]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-sm">
                      Aucune commande pour le moment
                    </TableCell>
                  </TableRow>
                ) : (
                  recent.map((txn) => {
                    const status = STATUS_MAP[txn.status] || { label: txn.status, variant: "outline" };
                    const itemCount = txn.items.reduce((sum, item) => sum + item.quantity, 0);
                    const clientName =
                      txn.metadata?.customerName ||
                      (txn.items[0]?.name ? `Client ${txn.items[0].name.slice(0, 8)}` : "—");
                    const orderId = txn.orderId || txn.id.slice(4, 12).toUpperCase();

                    return (
                      <TableRow key={txn.id}>
                        <TableCell className="font-mono text-xs font-medium">KDB-{orderId}</TableCell>
                        <TableCell className="text-sm">{clientName}</TableCell>
                        <TableCell className="text-sm">{itemCount}</TableCell>
                        <TableCell className="text-sm font-medium">
                          {txn.amount.toLocaleString("fr-FR")} {txn.currency}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant} className="rounded-full px-2.5 py-0.5 text-xs font-medium">
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {format(new Date(txn.createdAt), "dd/MM/yyyy", { locale: fr })}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
