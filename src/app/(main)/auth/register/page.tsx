"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { LanguageSwitcher } from "@/components/language-switcher";
import { APP_CONFIG } from "@/config/app-config";
import { RegisterForm } from "@/features/auth/components/register-form";
import { GoogleButton } from "@/features/auth/components/social-auth/google-button";

export default function RegisterV2() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <div className="flex min-h-[500px] w-full flex-col">
      <div className="mx-auto flex w-full max-w-[350px] flex-1 flex-col justify-center px-8 py-12">
        <div className="space-y-2 text-center">
          <h1 className="font-semibold text-2xl tracking-tight">Créer votre compte</h1>
          <p className="text-muted-foreground text-sm">
            Vous avez déjà un compte ?{" "}
            <Link
              href={callbackUrl ? `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/auth/login"}
              prefetch={false}
              className="text-primary underline-offset-4 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <RegisterForm callbackUrl={callbackUrl} />

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">ou s'inscrire avec</span>
          </div>

          <GoogleButton className="w-full" />
        </div>
      </div>

      <div className="flex w-full items-center justify-between px-6 py-4">
        <div className="text-muted-foreground text-sm">{APP_CONFIG.copyright}</div>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
