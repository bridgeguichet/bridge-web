"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { LanguageSwitcher } from "@/components/language-switcher";
import { APP_CONFIG } from "@/config/app-config";
import { LoginForm } from "@/features/auth/components/login-form";
import { useProfile } from "@/features/auth/hooks";

export default function Login() {
  const router = useRouter();
  const { data: profile, isLoading, isError } = useProfile(false);

  useEffect(() => {
    if (!isLoading && profile) {
      router.push("/dashboard");
    }
  }, [profile, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Vérification de la session...</div>
      </div>
    );
  }

  if (profile && !isError) {
    return null;
  }

  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="font-medium text-3xl">Connectez-vous a votre compte</h1>
          <p className="text-muted-foreground text-sm">Veuillez entrer vos identifiants pour vous connecter.</p>
        </div>
        <div className="space-y-4">
          {/* <GoogleButton className="w-full" />
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
          </div> */}
          <LoginForm />
        </div>
      </div>

      <div className="absolute top-5 flex w-full justify-end px-10">
        <div className="text-muted-foreground text-sm">
          Vous n'avez pas de compte?{" "}
          {/* <Link prefetch={false} className="text-foreground" href="register">
            S'inscrire
          </Link> */}
          Veuillez contacter votre administrateur.
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          {/* <Globe className="size-4 text-muted-foreground" /> */}
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
}
