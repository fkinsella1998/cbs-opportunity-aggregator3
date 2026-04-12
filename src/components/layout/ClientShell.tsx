"use client";

import { usePathname } from "next/navigation";

import AppShell from "@/components/layout/AppShell";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldWrap = pathname !== "/login" && pathname !== "/onboarding";

  return shouldWrap ? <AppShell>{children}</AppShell> : children;
}
