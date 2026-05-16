"use client";

import { useState } from "react";

import { Camera01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore, useChangePassword, useUpdateProfile } from "@/features/auth";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function ProfilePage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userAvatar =
    currentUser?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || "User")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const wantsPasswordChange = newPassword.length > 0 || confirmPassword.length > 0;

    if (wantsPasswordChange) {
      if (!currentPassword) {
        toast.error("Veuillez saisir votre mot de passe actuel");
        return;
      }
      if (newPassword.length < 8) {
        toast.error("Le nouveau mot de passe doit contenir au moins 8 caractères");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    updateProfile.mutate({ name, phone });
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mx-auto max-w-3xl">
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-10 text-center">
        <div className="flex items-center justify-center gap-2">
          <HugeiconsIcon icon={UserIcon} size={20} color="currentColor" className="text-accent" />
          <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Espace personnel</span>
        </div>
        <h1 className="mt-3 font-black text-4xl tracking-tight text-foreground md:text-5xl">
          Mon <span className="text-primary">profil</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">Gérez vos informations personnelles</p>
      </motion.div>

      {/* Avatar Section */}
      <motion.div variants={itemVariants} className="mb-10 flex flex-col items-center">
        <div className="relative">
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <img
              src={userAvatar}
              alt={currentUser?.name || "User"}
              className="h-36 w-36 rounded-full object-cover ring-4 ring-primary/10"
            />
            <Button
              size="icon"
              className="absolute bottom-1 right-1 h-10 w-10 rounded-full bg-accent text-accent-foreground shadow-lg transition-all hover:scale-110 hover:bg-accent/90"
            >
              <HugeiconsIcon icon={Camera01Icon} size={20} color="currentColor" />
            </Button>
          </motion.div>
          {/* Badge de rôle */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            <span className="rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground shadow-md">
              {currentUser?.role || "Customer"}
            </span>
          </div>
        </div>
        <h2 className="mt-6 font-bold text-2xl text-foreground">{currentUser?.name}</h2>
        <p className="text-muted-foreground">{currentUser?.email}</p>
      </motion.div>

      {/* Formulaire principal */}
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Section Informations */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="font-bold text-xl text-foreground">Informations personnelles</h3>
            <p className="text-sm text-muted-foreground">Mettez à jour vos coordonnées</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium text-foreground">
                Nom complet
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className="border-border bg-muted/30 transition-colors focus:bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                disabled
                className="border-border bg-muted/30 transition-colors focus:bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-medium text-foreground">
                Téléphone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+243 XXX XXX XXX"
                className="border-border bg-muted/30 transition-colors focus:bg-background"
              />
            </div>
          </div>
        </motion.div>

        {/* Section Mot de passe */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="font-bold text-xl text-foreground">Sécurité</h3>
            <p className="text-sm text-muted-foreground">Modifiez votre mot de passe</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="font-medium text-foreground">
                Mot de passe actuel
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="border-border bg-muted/30 transition-colors focus:bg-background md:max-w-sm"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="font-medium text-foreground">
                  Nouveau mot de passe
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-border bg-muted/30 transition-colors focus:bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="font-medium text-foreground">
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-border bg-muted/30 transition-colors focus:bg-background"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bouton de sauvegarde unique */}
        <motion.div variants={itemVariants} className="pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={updateProfile.isPending || changePassword.isPending}
            className="w-full bg-accent font-bold text-accent-foreground shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-accent/90 hover:shadow-lg sm:w-auto sm:px-8"
          >
            {updateProfile.isPending || changePassword.isPending ? "Mise à jour..." : "Mettre à jour le profil"}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
