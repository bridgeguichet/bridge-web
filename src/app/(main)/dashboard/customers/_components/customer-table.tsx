"use client";

import { Check, Eye, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User } from "@/features/admin";

interface CustomerTableProps {
  customers: User[];
  onViewDetails: (customerId: string) => void;
}

export function CustomerTable({ customers, onViewDetails }: CustomerTableProps) {
  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Vérifié</TableHead>
            <TableHead>Inscrit le</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell className="text-muted-foreground">{customer.email}</TableCell>
              <TableCell>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-sm">Client</span>
              </TableCell>
              <TableCell>
                {customer.emailVerified ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                    <Check className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30">
                    <X className="h-4 w-4" />
                  </span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(customer.createdAt)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onViewDetails(customer.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
