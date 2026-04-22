"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);

  // TEMPORAIREMENT DÉSACTIVÉ POUR LES TESTS
  // useEffect(() => {
  //   if (!currentUser) {
  //     router.push("/login");
  //   }
  // }, [currentUser, router]);

  // if (!currentUser) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="text-center">
  //         <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  //         <p className="text-lg text-gray-600">Chargement...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return <>{children}</>;
}
