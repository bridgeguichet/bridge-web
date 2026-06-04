"use client";

import { useEffect, useState, Suspense } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Loader2, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { APP_CONFIG } from "@/config/app-config";
import { authClient, signIn } from "@/lib/auth/auth-client";
import { useAuthStore } from "@/features/auth/store";
import type { User } from "@/features/auth/types";

const RESEND_COOLDOWN = 60; // 60 seconds cooldown

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      toast.error("Aucune adresse email fournie");
      router.push("/auth/register");
    }
  }, [email, router]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Veuillez entrer les 6 chiffres du code");
      return;
    }

    if (!email) return;

    setIsVerifying(true);

    try {
      const result = await authClient.emailOtp.verifyEmail({
        email,
        otp,
      });

      if (result.error) {
        throw new Error(result.error.message || "Code invalide");
      }

      // Auto sign-in with the temporarily stored password
      const pendingPw = sessionStorage.getItem("_bridge_pending_pw");
      if (!pendingPw) {
        // No password stored → redirect to login with message
        toast.success("Email vérifié ! Veuillez vous connecter.");
        router.push(`/auth/login?email=${encodeURIComponent(email)}`);
        return;
      }

      const signInResult = await signIn.email({ email, password: pendingPw });
      sessionStorage.removeItem("_bridge_pending_pw"); // Cleanup immediately

      if (signInResult.error) {
        toast.success("Email vérifié ! Veuillez vous connecter.");
        router.push("/auth/login");
        return;
      }

      const user = signInResult.data?.user as User;
      setCurrentUser(user);
      toast.success("Email vérifié avec succès !");

      if (user?.role === "admin" || user?.role === "vendor") {
        router.push("/dashboard");
      } else {
        router.push("/user-dashboard");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la vérification";
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;

    setIsResending(true);

    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (result.error) {
        throw new Error(result.error.message || "Erreur lors de l'envoi");
      }

      toast.success("Un nouveau code a été envoyé à votre adresse email");
      setCooldown(RESEND_COOLDOWN);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de l'envoi du code";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[500px] w-full flex-col">
      <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center px-8 py-12">
        <div className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="size-6 text-primary" />
          </div>
          <h1 className="font-semibold text-2xl tracking-tight">Vérifiez votre email</h1>
          <p className="text-muted-foreground text-sm">
            Entrez le code à 6 chiffres envoyé à{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={isVerifying}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying}
              className="w-full"
              size="lg"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                "Vérifier mon email"
              )}
            </Button>
          </div>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              ou
            </span>
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={isResending || cooldown > 0}
              className="text-sm"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : cooldown > 0 ? (
                <>
                  <RefreshCw className="mr-2 size-4" />
                  Renvoyer le code ({cooldown}s)
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 size-4" />
                  Renvoyer le code
                </>
              )}
            </Button>
          </div>

          <div className="text-center text-sm">
            <Link
              href="/auth/register"
              className="text-primary underline-offset-4 hover:underline"
            >
              Retour à l&apos;inscription
            </Link>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between px-6 py-4">
        <div className="text-muted-foreground text-sm">{APP_CONFIG.copyright}</div>
        <LanguageSwitcher />
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div className="flex min-h-[500px] w-full items-center justify-center">Chargement...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
