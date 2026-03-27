"use client";

import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Service } from "../types";

interface ServiceDetailDialogProps {
  service: Service;
  children?: React.ReactNode;
}

export function ServiceDetailDialog({ service, children }: ServiceDetailDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Info className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="text-xl">{service.title}</DialogTitle>
            {service.price && (
              <Badge variant="secondary" className="shrink-0">
                {service.price}
              </Badge>
            )}
          </div>
          {service.subcategory && (
            <p className="text-muted-foreground text-sm">
              {service.subcategory}
            </p>
          )}
        </DialogHeader>
        <DialogDescription className="text-base leading-relaxed text-foreground">
          {service.description}
        </DialogDescription>
        <div className="mt-4 rounded-lg bg-muted/50 p-4">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Catégorie
          </p>
          <p className="mt-1 font-medium text-sm">
            {service.category}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
