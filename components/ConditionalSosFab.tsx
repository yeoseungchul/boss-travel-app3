"use client";

import { usePathname } from "@/i18n/navigation";
import { SosFab } from "@/components/SosFab";

export function ConditionalSosFab() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return <SosFab />;
}
