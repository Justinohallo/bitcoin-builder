import { NextResponse } from "next/server";

import { loadLumaConfig } from "@/lib/luma-config";
import { LumaClient } from "@/lib/luma";

export type PublicLumaEvent = {
  eventApiId: string;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  timezone: string;
  url: string;
  coverUrl: string;
  meetingUrl?: string | null;
  locationText?: string | null;
};

function formatLocationText(event: {
  geo_address_json: null | {
    address?: string;
    full_address?: string | null;
    city_state?: string | null;
    city?: string | null;
    region?: string | null;
    country?: string | null;
  };
}): string | null {
  const addr = event.geo_address_json;
  if (!addr) return null;

  return (
    addr.full_address ||
    addr.address ||
    addr.city_state ||
    [addr.city, addr.region, addr.country].filter(Boolean).join(", ") ||
    null
  );
}

/**
 * GET /api/luma/public/events
 * Public: returns a safe subset of events managed by our Luma Calendar.
 */
export async function GET() {
  const config = loadLumaConfig();

  // If not configured, return empty list (don’t crash the public site).
  if (!config.apiKey) {
    return NextResponse.json(
      { events: [] as PublicLumaEvent[], configured: false },
      { status: 200 }
    );
  }

  const client = new LumaClient(config);
  const result = await client.listManagedEvents({ revalidateSeconds: 300 });

  const events: PublicLumaEvent[] = result.entries.map((entry) => {
    const e = entry.event;
    return {
      eventApiId: entry.api_id,
      name: e.name,
      description: e.description,
      startAt: e.start_at,
      endAt: e.end_at,
      timezone: e.timezone,
      url: e.url,
      coverUrl: e.cover_url,
      meetingUrl: e.meeting_url,
      locationText: formatLocationText(e),
    };
  });

  return NextResponse.json(
    { events, configured: true, hasMore: result.has_more },
    { status: 200 }
  );
}
