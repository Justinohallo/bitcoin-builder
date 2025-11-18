"use client";

import { useEffect, useRef } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import type { City, Merchant } from "@/lib/types";

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface CityMapProps {
  city: City;
  showClusters?: boolean;
  showMerchants?: boolean;
}

/**
 * Component to adjust map view when city data changes
 */
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  const hasSetView = useRef(false);

  useEffect(() => {
    if (!hasSetView.current) {
      map.setView(center, 13);
      hasSetView.current = true;
    }
  }, [map, center]);

  return null;
}

/**
 * CityMap component displays a map with merchant locations and city clusters
 * Uses Leaflet for rendering interactive maps
 */
export function CityMap({
  city,
  showClusters = true,
  showMerchants = true,
}: CityMapProps) {
  const center: [number, number] = [city.maps.center.lat, city.maps.center.lng];

  // Determine tile layer based on city's map style preference
  const getTileLayer = () => {
    switch (city.maps.merchantMapStyle) {
      case "dark":
        return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
      case "bitcoin":
        // Using a neutral style for now - can be customized with custom tiles
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      case "light":
      default:
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }
  };

  const attribution =
    city.maps.merchantMapStyle === "dark"
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-neutral-800">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ zIndex: 0 }}
      >
        <MapController center={center} />
        <TileLayer url={getTileLayer()} attribution={attribution} />

        {/* Display primary clusters */}
        {showClusters &&
          city.maps.primaryClusters.map((cluster, index) => (
            <Marker
              key={`cluster-${cluster.name}-${cluster.lat}-${cluster.lng}`}
              position={[cluster.lat, cluster.lng]}
              icon={L.divIcon({
                className: "custom-cluster-icon",
                html: `<div class="bg-orange-400 text-neutral-900 font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-neutral-900">${index + 1}</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              })}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-neutral-900 mb-1">
                    {cluster.name}
                  </h3>
                  <p className="text-sm text-neutral-700">
                    {cluster.description}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Display merchants */}
        {showMerchants &&
          city.bitcoinEcosystem.merchantList.map((merchant, index) => (
            <MerchantMarker
              key={`merchant-${merchant.name}-${merchant.latitude}-${merchant.longitude}`}
              merchant={merchant}
            />
          ))}
      </MapContainer>
    </div>
  );
}

/**
 * Individual merchant marker component
 */
function MerchantMarker({ merchant }: { merchant: Merchant }) {
  const getCategoryIcon = (category: Merchant["category"]) => {
    const icons: Record<string, string> = {
      cafe: "☕",
      restaurant: "🍽️",
      retail: "🛍️",
      bar: "🍺",
      service: "🔧",
      venue: "🎭",
      other: "📍",
    };
    return icons[category] || "📍";
  };

  return (
    <Marker
      position={[merchant.latitude, merchant.longitude]}
      icon={L.divIcon({
        className: "custom-merchant-icon",
        html: `<div class="bg-orange-400 text-neutral-900 font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-neutral-900 text-xs">${getCategoryIcon(merchant.category)}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <h3 className="font-semibold text-neutral-900 mb-1">
            {merchant.name}
          </h3>
          <p className="text-xs text-neutral-600 mb-2 capitalize">
            {merchant.category}
          </p>
          {merchant.description && (
            <p className="text-sm text-neutral-700 mb-2">
              {merchant.description}
            </p>
          )}
          <p className="text-xs text-neutral-600 mb-2">{merchant.address}</p>
          {merchant.paymentTypes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {merchant.paymentTypes.map((type, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded"
                >
                  {type}
                </span>
              ))}
            </div>
          )}
          {merchant.website && (
            <a
              href={merchant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-orange-600 hover:text-orange-800 underline"
            >
              Visit Website →
            </a>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
