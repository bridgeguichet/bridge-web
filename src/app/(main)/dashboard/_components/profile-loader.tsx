"use client";

import { useProfile } from "@/features/auth";

export function ProfileLoader() {
  useProfile();
  return null;
}
