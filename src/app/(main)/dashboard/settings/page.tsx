"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Eye, EyeOff, KeyRound, Loader2, Mail, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthStore, useChangePassword } from "@/features/auth";
import { authClient, signOut } from "@/lib/auth/auth-client";

const RESEND_COOLDOWN = 60;

export default function SettingsPage() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!newEmail || newEmail === currentUser?.email) {
      toast.error("Veuillez saisir une nouvelle adresse email différente de l'actuelle");
      return;
    }
    setIsSendingOtp(true);
    try {
      const result = await authClient.emailOtp.requestEmailChange({ newEmail });
      if (result.error) throw new Error(result.error.message || "Erreur lors de l'envoi");
      toast.success(`Code envoyé à ${newEmail}`);
      setOtpDialogOpen(true);
      setOtp("");
      startCooldown();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'envoi du code");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setIsResending(true);
    try {
      const result = await authClient.emailOtp.requestEmailChange({ newEmail });
      if (result.error) throw new Error(result.error.message || "Erreur lors de l'envoi");
      toast.success("Nouveau code envoyé");
      startCooldown();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors du renvoi");
    } finally {
      setIsResending(false);
    }
  };

  const handleConfirmEmailChange = async () => {
    if (otp.length !== 6) {
      toast.error("Veuillez entrer les 6 chiffres du code");
      return;
    }
    setIsChangingEmail(true);
    try {
      const result = await authClient.emailOtp.changeEmail({ newEmail, otp });
      if (result.error) throw new Error(result.error.message || "Code invalide");
      toast.success("Email modifié avec succès. Veuillez vous reconnecter.");
      setOtpDialogOpen(false);
      clearAuth();
      await signOut();
      router.push("/auth/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la modification");
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleChangePassword = () => {
    setPasswordError("");
    if (newPassword.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return;
    }
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  };

  const isEmailVerified = currentUser?.emailVerified ?? false;

  if (!currentUser) return null;

  return (
    <>
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Vérifier votre nouvel email</DialogTitle>
            <DialogDescription>
              Un code à 6 chiffres a été envoyé à{" "}
              <span className="font-medium text-foreground">{newEmail}</span>. Entrez-le ci-dessous pour confirmer le
              changement.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-2">
            <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isChangingEmail}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button onClick={handleConfirmEmailChange} disabled={otp.length !== 6 || isChangingEmail} className="w-full">
              {isChangingEmail ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Modification...
                </>
              ) : (
                "Confirmer le changement"
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResendOtp}
              disabled={isResending || cooldown > 0}
              className="text-muted-foreground text-sm"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Envoi...
                </>
              ) : cooldown > 0 ? (
                <>
                  <RefreshCw className="mr-2 size-4" />
                  Renvoyer ({cooldown}s)
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 size-4" />
                  Renvoyer le code
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez la sécurité et les accès de votre compte</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="size-5 text-muted-foreground" />
                <CardTitle>Adresse email</CardTitle>
              </div>
              <Badge
                variant={isEmailVerified ? "default" : "secondary"}
                className={isEmailVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}
              >
                {isEmailVerified ? "Vérifié" : "Non vérifié"}
              </Badge>
            </div>
            <CardDescription>Modifiez votre adresse email de connexion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email actuel</Label>
              <Input value={currentUser.email} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Nouvel email</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="nouveau@email.com"
              />
            </div>
            <Button onClick={handleSendOtp} disabled={isSendingOtp || !newEmail}>
              {isSendingOtp ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le code de vérification"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="size-5 text-muted-foreground" />
              <CardTitle>Modifier le mot de passe</CardTitle>
            </div>
            <CardDescription>Choisissez un mot de passe fort d'au moins 6 caractères</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {passwordError && <p className="text-destructive text-sm">{passwordError}</p>}

            <Separator />

            <div className="flex justify-end">
              <Button
                onClick={handleChangePassword}
                disabled={changePassword.isPending || !currentPassword || !newPassword || !confirmPassword}
              >
                {changePassword.isPending ? "Modification..." : "Modifier le mot de passe"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
