import Link from "next/link";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface ServiceDetailHeaderProps {
  serviceName: string;
  categoryName: string;
}

export function ServiceDetailHeader({ serviceName, categoryName }: ServiceDetailHeaderProps) {
  return (
    <nav className="flex items-center gap-3 text-base font-semibold text-muted-foreground transition-all duration-300">
      <Link href="/marketplace" className="hover:text-primary transition-colors">
        Marketplace
      </Link>
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" className="transition-transform transform hover:scale-110"/>
      {categoryName && (
        <>
          <span className="hover:text-primary transition-colors">{categoryName}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" className="transition-transform transform hover:scale-110"/>
        </>
      )}
      <span className="text-foreground font-bold">{serviceName}</span>
    </nav>
  );
}
