"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";

import { EmptyState } from "@/external-components/user-dashboard/empty-state";

export default function NotificationsPage() {
  const notifications = [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-black text-gray-900 md:text-5xl">
          Notifications
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Restez informé de l'activité de votre compte
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="Aucune notification"
            description="Vous n'avez pas de nouvelles notifications pour le moment."
          />
        ) : (
          <div className="space-y-4">
            {/* Notifications list will be added here */}
          </div>
        )}
      </motion.div>
    </div>
  );
}
