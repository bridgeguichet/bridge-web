"use client";
import type { ReactNode } from "react";

// import { useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Command } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";
import { useProfile } from "@/features/auth/hooks";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  // const router = useRouter();
  // const { data: profile, isLoading, isError } = useProfile();

  // useEffect(() => {
  //   if (!isLoading && profile) {
  //     router.push("/dashboard");
  //   }
  // }, [profile, isLoading, router]);

  // if (isLoading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="text-muted-foreground">
  //         Vérification de la session...
  //       </div>
  //     </div>
  //   );
  // }

  // if (profile && !isError) {
  //   return null;
  // }
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="relative order-2 hidden h-full overflow-hidden rounded-3xl bg-primary lg:flex">
          <Image
            src="/media/trackmine-login.jpg"
            alt={`${APP_CONFIG.name} Mineral Traceability`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/60" />
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
