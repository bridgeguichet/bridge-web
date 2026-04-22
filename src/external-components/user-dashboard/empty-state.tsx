"use client";

import Link from "next/link";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

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
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center"
    >
      <div className="mb-4 rounded-full bg-primary/10 p-6">
        <Icon className="h-12 w-12 text-primary" />
      </div>
      <h3 className="mb-2 text-2xl font-bold text-gray-900">{title}</h3>
      <p className="mb-6 max-w-md text-gray-600">{description}</p>
      {action && (
        <Button asChild className="bg-accent font-bold text-primary hover:bg-accent/90">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </motion.div>
  );
}
