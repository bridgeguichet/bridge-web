"use client";

import { useState } from "react";

import { Camera, Mail, Phone, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthStore, useUpdateProfile } from "@/features/auth";
import { getInitials } from "@/lib/utils";

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
          <CardHeader className="items-center text-center">
            <div className="relative">
              <Avatar className="size-24 rounded-full">
                <AvatarImage src={avatar} alt={currentUser.name} />
                <AvatarFallback className="text-2xl">{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
              >
                <Camera className="size-4" />
              </button>
            </div>
            <CardTitle className="mt-2">{currentUser.name}</CardTitle>
            <CardDescription>{currentUser.email}</CardDescription>
            <Badge variant="secondary" className="capitalize">
              {currentUser.role ?? "admin"}
            </Badge>
          </CardHeader>
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
