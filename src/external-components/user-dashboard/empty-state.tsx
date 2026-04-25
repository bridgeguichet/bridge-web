"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-12 text-center"
    >
      <motion.div whileHover={{ rotate: 6, scale: 1.05 }} className="mb-6 rounded-2xl bg-primary/10 p-6">
        <Icon className="h-12 w-12 text-primary" />
      </motion.div>
      <h3 className="mb-2 font-bold text-2xl text-foreground">{title}</h3>
      <p className="mb-8 max-w-md leading-relaxed text-muted-foreground">{description}</p>
      {action && (
        <Button
          asChild
          className="bg-accent font-bold text-accent-foreground shadow-md transition-all duration-300 hover:bg-accent/90 hover:shadow-lg hover:scale-105"
        >
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </motion.div>
  );
}
