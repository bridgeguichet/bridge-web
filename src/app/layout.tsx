import type { ReactNode } from "react";

import { Inter } from "next/font/google";

import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config/app-config";
import { I18nProvider } from "@/lib/i18n/i18n-provider";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { QueryProvider } from "@/lib/react-query/query-provider";
import { ThemeBootScript } from "@/scripts/theme-boot";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { theme_mode, theme_preset, content_layout, navbar_style, sidebar_variant, sidebar_collapsible } =
    PREFERENCE_DEFAULTS;
  return (
    <html
      lang="fr"
      className={theme_mode}
      data-theme-preset={theme_preset}
      data-content-layout={content_layout}
      data-navbar-style={navbar_style}
      data-sidebar-variant={sidebar_variant}
      data-sidebar-collapsible={sidebar_collapsible}
      suppressHydrationWarning
    >
      <head>
        {/* Applies theme and layout preferences on load to avoid flicker and unnecessary server rerenders. */}
        <ThemeBootScript />
      </head>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <QueryProvider>
          <I18nProvider>
            <PreferencesStoreProvider
              themeMode={theme_mode}
              themePreset={theme_preset}
              contentLayout={content_layout}
              navbarStyle={navbar_style}
            >
              {children}
              <Toaster richColors />
            </PreferencesStoreProvider>
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
