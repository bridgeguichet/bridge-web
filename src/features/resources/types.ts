import type { Resource } from "@/lib/db/schema";

export interface ResourceFilters {
  type?: string;
  status?: string;
  [key: string]: string | undefined;
}

export type { Resource };
