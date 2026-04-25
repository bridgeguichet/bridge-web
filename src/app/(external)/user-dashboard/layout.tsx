"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { AuthGuard } from "@/external-components/user-dashboard/auth-guard";
import { UserHeader } from "@/external-components/user-dashboard/user-header";
import { UserSidebar } from "@/external-components/user-dashboard/user-sidebar";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <UserSidebar />

        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -288 }}
                animate={{ x: 0 }}
                exit={{ x: -288 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed left-0 top-0 z-30 h-screen w-72 border-r border-border bg-card shadow-2xl lg:hidden"
              >
                <UserSidebar />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="lg:pl-72">
          <UserHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="p-6 md:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
