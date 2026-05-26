"use client";

import { useState } from "react";

import { Mail, Phone, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthStore, useUpdateProfile } from "@/features/auth";
import { getInitials } from "@/lib/utils";

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  admin: { label: "Administrateur", color: "bg-purple-100 text-purple-700" },
  manager: { label: "Manager", color: "bg-blue-100 text-blue-700" },
  operator: { label: "Opérateur", color: "bg-gray-100 text-gray-600" },
  user: { label: "Utilisateur", color: "bg-green-100 text-green-700" },
};

function RoleBadge({ role }: { role: string }) {
  const config = ROLE_CONFIG[role] || { label: role, color: "bg-muted text-muted-foreground" };
  return (
    <Badge className={`${config.color} border-0 px-3 py-1 text-sm font-medium`}>{config.label}</Badge>
  );
}

export default function ProfilePage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState(currentUser?.name ?? "");
  const [phone, setPhone] = useState((currentUser as any)?.phone ?? "");

  if (!currentUser) return null;

  const avatar =
    currentUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&size=128`;

  const handleSave = () => {
    updateProfile.mutate({ name, phone: phone || undefined });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Profil</h1>
        <p className="text-muted-foreground">Consultez et modifiez vos informations personnelles</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center justify-center gap-3 pt-8 pb-8 text-center">
            <Avatar className="size-24 rounded-full">
              <AvatarImage src={avatar} alt={currentUser.name} />
              <AvatarFallback className="text-2xl">{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-semibold text-lg leading-tight">{currentUser.name}</p>
              <p className="text-muted-foreground text-sm">{currentUser.email}</p>
            </div>
            <RoleBadge role={(currentUser as any).role ?? "admin"} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
            <CardDescription>Mettez à jour votre nom et votre numéro de téléphone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  className="pl-9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" className="pl-9 bg-muted" value={currentUser.email} disabled />
              </div>
              <p className="text-muted-foreground text-xs">
                Pour modifier votre email, rendez-vous dans les Paramètres.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  className="pl-9"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+243 ..."
                />
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
