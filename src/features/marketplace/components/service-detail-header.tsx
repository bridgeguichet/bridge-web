import Link from "next/link";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface ServiceDetailHeaderProps {
  serviceName: string;
  categoryName: string;
}

export function ServiceDetailHeader({ serviceName, categoryName }: ServiceDetailHeaderProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/marketplace" className="hover:text-foreground transition-colors">
        Marketplace
      </Link>
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" />
      {categoryName && (
        <>
          <span className="hover:text-foreground transition-colors">{categoryName}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" />
        </>
      )}
      <span className="text-foreground font-medium">{serviceName}</span>
    </nav>
  );
}
