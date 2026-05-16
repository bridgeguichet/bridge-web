"use client";

import Link from "next/link";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface EmptyStateProps {
  icon: IconSvgElement;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex w-full flex-col items-center border-dashed bg-linear-to-t from-primary/5 to-card py-8 text-center shadow-xs">
      <CardHeader className="w-full items-center justify-items-center gap-2 pb-4">
        <div className="w-fit rounded-xl bg-muted p-4">
          <HugeiconsIcon icon={Icon} size={40} color="currentColor" className="text-muted-foreground" />
        </div>
        <CardTitle className="text-xl text-balance">{title}</CardTitle>
        <CardDescription className="max-w-md text-balance">{description}</CardDescription>
      </CardHeader>
      {action && (
        <CardFooter className="justify-center pt-2">
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
