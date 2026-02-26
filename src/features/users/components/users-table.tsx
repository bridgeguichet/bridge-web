"use client";

import { useState } from "react";

import { MoreHorizontal, Pencil, Trash2, UserCheck, UserX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useActivateUser, useDeactivateUser, useDeleteUser, useUsers } from "@/features/users";
import type { UserDetail } from "@/features/users/types";

interface UsersTableProps {
  onEdit?: (user: UserDetail) => void;
  onView?: (user: UserDetail) => void;
}

export function UsersTable({ onEdit, onView }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: usersData, isLoading } = useUsers({ search, page });
  const deleteUser = useDeleteUser();
  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      deleteUser.mutate(id);
    }
  };

  const handleActivate = (id: string) => {
    activateUser.mutate(id);
  };

  const handleDeactivate = (id: string) => {
    deactivateUser.mutate(id);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom complet</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData?.results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              usersData?.results.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.is_active ? (
                      <Badge variant="default">Actif</Badge>
                    ) : (
                      <Badge variant="secondary">Inactif</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.is_staff ? (
                      <Badge variant="outline">Staff</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {onView && <DropdownMenuItem onClick={() => onView(user)}>Voir détails</DropdownMenuItem>}
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {user.is_active ? (
                          <DropdownMenuItem onClick={() => handleDeactivate(user.id)}>
                            <UserX className="mr-2 h-4 w-4" />
                            Désactiver
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleActivate(user.id)}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activer
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {usersData && usersData.count > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {usersData.results.length} sur {usersData.count} utilisateur(s)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!usersData.previous}
            >
              Précédent
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={!usersData.next}>
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
