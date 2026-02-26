import { Command } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";
import { cn } from "@/lib/utils";

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
  return (
    <>
      <Command className="size-10" />
      <span>{APP_CONFIG.name}</span>
    </>
  );
};

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
  return <Command className="size-10" />;
};

export const LogoStroke = ({ className }: { className?: string }) => {
  return <Command className="size-10" />;
};
