"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Order } from "@/features/orders/types";

interface RecentPacketsProps {
  orders: Order[];
  isLoading?: boolean;
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  completed: { label: "Livré", variant: "default" },
  pending: { label: "En préparation", variant: "secondary" },
  failed: { label: "Échoué", variant: "destructive" },
  refunded: { label: "Remboursé", variant: "outline" },
};

export function RecentPackets({ orders, isLoading }: RecentPacketsProps) {
  return (
    <Card className="border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-semibold text-base">Packets récents</CardTitle>
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
                  <TableHead className="w-[140px]">N° packet</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="w-[80px]">Articles</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="w-[120px]">Statut</TableHead>
                  <TableHead className="w-[100px]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-sm">
                      Aucun packet pour le moment
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const status = STATUS_MAP[order.status] || { label: order.status, variant: "outline" };
                    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                    const clientName =
                      (order.metadata?.customerName as string) ||
                      (order.items[0]?.name ? `Client ${order.items[0].name.slice(0, 8)}` : "—");
                    const packetNumber = order.orderNumber || order.id.slice(4, 12).toUpperCase();

                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs font-medium">PKT-{packetNumber}</TableCell>
                        <TableCell className="text-sm">{clientName}</TableCell>
                        <TableCell className="text-sm">{itemCount}</TableCell>
                        <TableCell className="text-sm font-medium">
                          {Number(order.amount).toLocaleString("fr-FR")} {order.currency}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant} className="rounded-full px-2.5 py-0.5 text-xs font-medium">
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {format(new Date(order.createdAt), "dd/MM/yyyy", { locale: fr })}
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
