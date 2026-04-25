import Link from "next/link";

import { ChevronRight } from "lucide-react";

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
      <ChevronRight className="h-4 w-4" />
      {categoryName && (
        <>
          <span className="hover:text-foreground transition-colors">{categoryName}</span>
          <ChevronRight className="h-4 w-4" />
        </>
      )}
      <span className="text-foreground font-medium">{serviceName}</span>
    </nav>
  );
}
