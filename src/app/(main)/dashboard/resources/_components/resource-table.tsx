"use client";

import { Car, MoreHorizontal, Pencil, Trash2, User, UserCog } from "lucide-react";

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
import type { Resource } from "@/features/admin";
import { useDeleteResource } from "@/features/admin";

interface ResourceTableProps {
  resources: Resource[];
  onEdit: (resourceId: string) => void;
}

const typeLabels: Record<string, string> = {
  driver: "Chauffeur",
  vehicle: "Véhicule",
  staff: "Personnel",
};

const typeIcons: Record<string, React.ElementType> = {
  driver: User,
  vehicle: Car,
  staff: UserCog,
};

export function ResourceTable({ resources, onEdit }: ResourceTableProps) {
  const deleteResourceMutation = useDeleteResource();

  const handleDelete = (resourceId: string) => {
    deleteResourceMutation.mutate(resourceId);
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Informations</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => {
            const TypeIcon = typeIcons[resource.type] || User;
            const metadata = resource.metadata as Record<string, unknown> | undefined;

            return (
              <TableRow key={resource.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <TypeIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{resource.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{typeLabels[resource.type]}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={resource.status === "available" ? "default" : "secondary"}
                    className={
                      resource.status === "available"
                        ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                    }
                  >
                    {resource.status === "available" ? "Disponible" : "Non disponible"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-muted-foreground text-sm">
                    {metadata ? (
                      <span>
                        {Object.entries(metadata)
                          .slice(0, 2)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(" • ")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(resource.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
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
                            <AlertDialogTitle>Supprimer la ressource</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer la ressource "{resource.name}" ?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(resource.id)}
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
