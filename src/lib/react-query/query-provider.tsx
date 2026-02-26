"use client";

import { type ReactNode, useState } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./query-client";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => queryClient);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
