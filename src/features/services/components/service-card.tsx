"use client";

import { Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Service } from "../types";
import { ServiceDetailDialog } from "./service-detail-dialog";
import { useTranslation } from "@/lib/i18n/use-translation";
import { getServiceTranslationKey, getSubcategoryTranslationKey } from "../utils";

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: (serviceId: string) => void;
}

export function ServiceCard({ service, isSelected, onToggle }: ServiceCardProps) {
  const { t } = useTranslation();
  const serviceKey = getServiceTranslationKey(service.id);
  const displayDescription = service.shortDescription || service.description;
  const hasShortDescription = !!service.shortDescription;

  return (
    <Card
      onClick={() => onToggle(service.id)}
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        isSelected
          ? "border-2 border-primary bg-primary/5 shadow-md"
          : "border-2 border-transparent hover:border-primary/30",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base leading-tight">
                {t(`services.${serviceKey}.title`)}
              </CardTitle>
              {service.price && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  {service.price}
                </Badge>
              )}
            </div>
            {service.subcategory && (
              <p className="text-muted-foreground text-xs mt-0.5">
                {t(`services.subcategories.${getSubcategoryTranslationKey(service.subcategory)}`)}
              </p>
            )}
          </div>
          <div
            className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300",
              isSelected
                ? "bg-primary border-primary"
                : "border-muted-foreground/30",
            )}
          >
            {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <CardDescription className="text-sm leading-relaxed">
          {hasShortDescription ? t(`services.${serviceKey}.shortDescription`) : t(`services.${serviceKey}.description`)}
        </CardDescription>
        {hasShortDescription && (
          <div className="flex items-center gap-2">
            <ServiceDetailDialog service={service}>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto gap-2 px-0 font-medium text-primary text-xs hover:bg-transparent hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {t("common.readMore")}
                <Info className="h-3.5 w-3.5" />
              </Button>
            </ServiceDetailDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
