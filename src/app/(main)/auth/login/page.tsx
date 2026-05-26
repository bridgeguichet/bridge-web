"use client";

import { useEffect, Suspense } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config/app-config";
import { LoginForm } from "@/features/auth/components/login-form";
import { useProfile } from "@/features/auth/hooks";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const { data: profile, isLoading, isError } = useProfile(false);

  useEffect(() => {
    if (!isLoading && profile) {
      const role = profile.user?.role;
      if (role === "admin" || role === "vendor") {
        router.push("/dashboard");
      } else {
        router.push(callbackUrl || "/user-dashboard");
      }
    }
  }, [profile, isLoading, router, callbackUrl]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="text-muted-foreground">Vérification de la session...</div>
      </div>
    );
  }

  if (profile && !isError) {
    return null;
  }

  return (
    <div className="flex min-h-[500px] w-full flex-col">
      <div className="mx-auto flex w-full max-w-[350px] flex-1 flex-col justify-center px-8 py-12">
        <div className="space-y-2 text-center">
          <h1 className="font-semibold text-2xl tracking-tight">Connectez-vous à votre compte</h1>
          <p className="text-muted-foreground text-sm">
            Vous n'avez pas de compte ?{" "}
            <Link
              href={callbackUrl ? `/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/auth/register"}
              prefetch={false}
              className="text-primary underline-offset-4 hover:underline"
            >
              S'inscrire
            </Link>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <LoginForm callbackUrl={callbackUrl} />

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">ou se connecter avec</span>
          </div>

          <Button variant="outline" className="w-full hover:text-background" type="button">
            <svg className="mr-2 size-4" viewBox="0 0 24 24" role="img" aria-label="Google">
              <title>Google</title>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Se connecter avec Google
          </Button>
        </div>
      </div>

      <div className="flex w-full items-center justify-between px-6 py-4">
        <div className="text-muted-foreground text-sm">{APP_CONFIG.copyright}</div>
        <LanguageSwitcher />
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="flex min-h-[500px] w-full items-center justify-center">Chargement...</div>}>
      <LoginContent />
    </Suspense>
  );
}
