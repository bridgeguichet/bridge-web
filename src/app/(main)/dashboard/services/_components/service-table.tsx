"use client";

import { MoreHorizontal, Pencil, Settings2, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ServiceWithRelations } from "@/features/admin";
import { useDeleteService } from "@/features/admin";

interface ServiceTableProps {
  services: ServiceWithRelations[];
  onEdit: (serviceId: string) => void;
  onManageVariants: (serviceId: string) => void;
}

const priceUnitLabels: Record<string, string> = {
  hour: "/heure",
  day: "/jour",
  month: "/mois",
  unit: "/unité",
};

const statusLabels: Record<string, string> = {
  active: "Actif",
  draft: "Brouillon",
  archived: "Archivé",
};

export function ServiceTable({ services, onEdit, onManageVariants }: ServiceTableProps) {
  const deleteServiceMutation = useDeleteService();

  const handleDelete = (serviceId: string) => {
    deleteServiceMutation.mutate(serviceId);
  };

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-12 text-center">
        <div className="rounded-full bg-primary/10 p-3">
          <Settings2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mt-4 font-semibold text-lg">Aucun service trouvé</h3>
        <p className="mt-1 text-muted-foreground text-sm">Commencez par créer votre premier service.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Variantes</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.nameFr}</TableCell>
              <TableCell>{service.category?.nameFr || "—"}</TableCell>
              <TableCell>
                {service.basePrice} USD{priceUnitLabels[service.priceUnit]}
              </TableCell>
              <TableCell>
                <Badge variant={service.status === "active" ? "default" : "secondary"}>
                  {statusLabels[service.status] || service.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onManageVariants(service.id)}
                  className="h-auto px-2 py-1 text-xs"
                >
                  {service.variants?.length || 0} variante(s)
                </Button>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(service.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onManageVariants(service.id)}>
                      <Settings2 className="mr-2 h-4 w-4" />
                      Gérer les variantes
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le service</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer le service "{service.nameFr}" ? Cette action supprimera
                            également toutes les variantes associées.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(service.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
