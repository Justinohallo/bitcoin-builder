"use client";

import dynamic from "next/dynamic";

import type { City } from "@/lib/types";

// Dynamic import for client-side map component
const CityMap = dynamic(
  () => import("./CityMap").then((mod) => ({ default: mod.CityMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
        <p className="text-neutral-400">Loading map...</p>
      </div>
    ),
  }
);

interface CityMapClientProps {
  city: City;
  showClusters?: boolean;
  showMerchants?: boolean;
}

export function CityMapClient({
  city,
  showClusters = true,
  showMerchants = true,
}: CityMapClientProps) {
  return (
    <CityMap
      city={city}
      showClusters={showClusters}
      showMerchants={showMerchants}
    />
  );
}
