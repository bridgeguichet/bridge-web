"use client";

import { motion } from "framer-motion";
import { Notification01Icon } from "@hugeicons/core-free-icons";

import { EmptyState } from "@/components/user-dashboard/empty-state";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

export default function NotificationsPage() {
  const notifications = [];

  return (
    <div className="space-y-6">
      <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <HugeiconsIcon icon={Notification01Icon} size={24} color="currentColor" className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Mes notifications</h1>
              <p className="text-muted-foreground">
                Restez informé de l'activité de votre compte
              </p>
            </div>
          </div>
        </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {notifications.length === 0 ? (
          <EmptyState
            icon={Notification01Icon}
            title="Aucune notification"
            description="Vous n'avez pas de nouvelles notifications pour le moment."
          />
        ) : (
          <div className="space-y-4">{/* Notifications list will be added here */}</div>
        )}
      </motion.div>
    </div>
  );
}
