import { Mail, MapPin, Phone, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Vendor } from "@/lib/db/schema";

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  const initials = vendor.companyName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="sticky top-4 p-6">
      <h3 className="mb-4 text-lg font-semibold">Prestataire</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{vendor.companyName}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.9</span>
              <span>(156 avis)</span>
            </div>
            {vendor.isBridgeOfficial && (
              <span className="inline-flex items-center gap-1 text-xs text-primary">
                ✓ Prestataire officiel Bridge
              </span>
            )}
          </div>
        </div>

        {vendor.description && (
          <p className="text-sm text-muted-foreground">{vendor.description}</p>
        )}

        <div className="border-t pt-4">
          <Button variant="outline" className="w-full" disabled>
            Contacter le prestataire
          </Button>

          <p className="mt-2 text-xs text-center text-muted-foreground">
            Fonctionnalité bientôt disponible
          </p>
        </div>
      </div>
    </Card>
  );
}
