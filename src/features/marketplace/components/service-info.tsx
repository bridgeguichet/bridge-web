import { DollarSign, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ServiceInfoProps {
  serviceName: string;
  description?: string | null;
  basePrice: string;
  priceUnit: string;
  hasVariants: boolean;
}

export function ServiceInfo({ serviceName, description, basePrice, priceUnit, hasVariants }: ServiceInfoProps) {
  const priceUnitLabel = {
    hour: "heure",
    day: "jour",
    month: "mois",
    unit: "unité",
  }[priceUnit] || priceUnit;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">{serviceName}</h1>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">4.8</span>
              <span className="text-sm text-muted-foreground">(24 avis)</span>
            </div>
            <Badge variant="secondary">Populaire</Badge>
          </div>
        </div>

        {description && <p className="text-muted-foreground">{description}</p>}

        <div className="flex items-baseline gap-2 border-t pt-4">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <div>
            <span className="text-3xl font-bold">${basePrice}</span>
            <span className="text-muted-foreground"> / {priceUnitLabel}</span>
            {hasVariants && <p className="text-sm text-muted-foreground mt-1">Prix à partir de (selon variante)</p>}
          </div>
        </div>
      </div>
    </Card>
  );
}
