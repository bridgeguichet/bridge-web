import { cn } from "@/lib/utils";

interface CornerDecoProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

export function CornerDeco({ position, className }: CornerDecoProps) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  };

  return (
    <div className={cn("absolute w-6 h-6", positionClasses[position], className)}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0 L24 0 L24 4 L8 4 L8 8 L4 8 L4 24 L0 24 Z" fill="currentColor" className="text-accent" />
        <path d="M4 4 L8 4 L8 8 L4 8 Z" fill="currentColor" className="text-primary" />
      </svg>
    </div>
  );
}
