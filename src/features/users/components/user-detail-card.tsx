"use client";

import { Mail, Shield, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserDetail } from "@/features/users/types";

interface UserDetailCardProps {
  user: UserDetail;
}

export function UserDetailCard({ user }: UserDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {user.full_name}
        </CardTitle>
        <CardDescription>Détails de l&apos;utilisateur</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{user.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {user.is_staff ? (
              <Badge variant="outline">Staff</Badge>
            ) : (
              <span className="text-muted-foreground">Utilisateur standard</span>
            )}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Statut</span>
            {user.is_active ? <Badge variant="default">Actif</Badge> : <Badge variant="secondary">Inactif</Badge>}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Créé le</span>
            <span className="text-sm">{new Date(user.created_at).toLocaleDateString("fr-FR")}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Modifié le</span>
            <span className="text-sm">{new Date(user.updated_at).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        {user.organizations && user.organizations.length > 0 && (
          <div className="space-y-2">
            <span className="text-muted-foreground text-sm">Organisations</span>
            <div className="space-y-1">
              {user.organizations.map((org) => (
                <div key={org.organization_id} className="flex items-center justify-between text-sm">
                  <span>{org.organization_name}</span>
                  <Badge variant="outline">{org.role_display}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
