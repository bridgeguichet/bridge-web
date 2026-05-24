import type { ReactNode } from "react";

import Image from "next/image";

import { APP_CONFIG } from "@/config/app-config";

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
    <main className="flex min-h-dvh items-center justify-center bg-muted/40 p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-background shadow-lg">
        <div className="relative hidden w-1/2 bg-muted lg:block">
          <Image
            src="/media/log-reg-image.jpg"
            alt={`${APP_CONFIG.name} Authentication`}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex w-full flex-col lg:w-1/2">{children}</div>
      </div>
    </main>
  );
}
