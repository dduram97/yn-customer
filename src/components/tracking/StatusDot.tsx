"use client";

import type { CustomerStatusKey } from "@/lib/tracking/types";

export function StatusDot({ statusKey }: { statusKey: CustomerStatusKey }) {
  const color =
    statusKey === "DELIVERED"
      ? "bg-blue-600"
      : statusKey === "IN_TRANSIT"
        ? "bg-emerald-500"
        : "bg-orange-500";

  return <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />;
}

