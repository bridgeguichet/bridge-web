import { cn } from "@/lib/utils";
import { CornerDeco } from "./corner-deco";

interface BorderDecoProps {
  children: React.ReactNode;
  className?: string;
}

export function BorderDeco({ children, className }: BorderDecoProps) {
  return (
    <div className={cn("relative", className)}>
      <CornerDeco position="top-left" />
      <CornerDeco position="top-right" />
      <CornerDeco position="bottom-left" />
      <CornerDeco position="bottom-right" />
      {children}
    </div>
  );
}
