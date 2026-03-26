"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Service } from "../types";

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: (serviceId: string) => void;
}

export function ServiceCard({ service, isSelected, onToggle }: ServiceCardProps) {
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
                {service.title}
              </CardTitle>
              {service.price && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  {service.price}
                </Badge>
              )}
            </div>
            {service.subcategory && (
              <p className="text-muted-foreground text-xs mt-0.5">
                {service.subcategory}
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
      <CardContent className="pt-0">
        <CardDescription className="text-sm leading-relaxed">
          {service.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
