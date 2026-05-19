"use client";

import { Calendar, Check, Mail, Phone, User, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCustomerUsers } from "@/features/admin";

interface CustomerDetailDialogProps {
  open: boolean;
  onOpenChange: () => void;
  customerId: string | null;
}

export function CustomerDetailDialog({ open, onOpenChange, customerId }: CustomerDetailDialogProps) {
  const { data: customerUsers } = useCustomerUsers();

  const customer = customerId ? customerUsers?.find((c) => c.id === customerId) : null;

  if (!customer) return null;

  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(d);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle>{customer.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                Client
                {customer.emailVerified ? (
                  <Badge variant="outline" className="border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20">
                    <Check className="mr-1 h-3 w-3" />
                    Vérifié
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20">
                    <X className="mr-1 h-3 w-3" />
                    Non vérifié
                  </Badge>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Informations de contact</h4>

            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="text-sm">{customer.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">Téléphone</p>
                  <p className="text-sm">{customer.phone || "Non renseigné"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-xs">Inscrit le</p>
                  <p className="text-sm">{formatDate(customer.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
