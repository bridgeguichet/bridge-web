// "use client";

// import Link from "next/link";

// import { Button } from "@/components/ui/button";

// export default function NotFound() {
//   return (
//     <div className="flex h-dvh flex-col items-center justify-center space-y-2 text-center">
//       <h1 className="font-semibold text-2xl">Page not found.</h1>
//       <p className="text-muted-foreground">The page you are looking for could not be found.</p>
//       <Link prefetch={false} replace href="/dashboard/default">
//         <Button variant="outline">Go back home</Button>
//       </Link>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";

const ErrorPage = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <h2 className="mb-6 font-semibold text-5xl">Whoops!!</h2>
        <h3 className="mb-1.5 font-semibold text-3xl">Something went wrong</h3>
        <p className="mb-6 max-w-sm text-muted-foreground">
          The page you&apos;re looking for isn&apos;t found, we suggest you back to home.
        </p>
        <Button asChild size="lg" className="rounded-lg text-base">
          <a href="/">Back to home page</a>
        </Button>
      </div>

      {/* Right Section: Illustration */}
      <div className="relative max-h-screen w-full p-2 max-lg:hidden">
        <div className="h-full w-full rounded-2xl bg-black" />
        <img
          src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/error/image-1.png"
          alt="404 illustration"
          className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[clamp(260px,25vw,406px)]"
        />
      </div>
    </div>
  );
};

export default ErrorPage;
