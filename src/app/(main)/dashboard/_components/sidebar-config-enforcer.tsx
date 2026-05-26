"use client";

import { useEffect } from "react";

export function SidebarConfigEnforcer() {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-sidebar-variant", "sidebar");
    root.setAttribute("data-sidebar-collapsible", "icon");

    document.cookie = "sidebar_variant=sidebar; path=/; max-age=604800";
    document.cookie = "sidebar_collapsible=icon; path=/; max-age=604800";
  }, []);

  return null;
}
