"use client";

import { useEffect, useMemo, useState } from "react";

import type { LumaCalendarListEventsResponse } from "@/lib/luma";

type CreateFormState = {
  name: string;
  startAtLocal: string;
  timezone: string;
  descriptionMd: string;
};

function toIsoOrUndefined(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export function LumaEventsManager() {
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LumaCalendarListEventsResponse | null>(null);

  const [form, setForm] = useState<CreateFormState>({
    name: "",
    startAtLocal: "",
    timezone:
      Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Vancouver",
    descriptionMd: "",
  });

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.timezone.trim().length > 0 &&
      !!toIsoOrUndefined(form.startAtLocal)
    );
  }, [form.name, form.startAtLocal, form.timezone]);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "/api/luma/events?pagination_limit=25&sort_column=start_at&sort_direction=asc",
        { method: "GET" }
      );

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(
          json?.message || json?.error || "Failed to load events"
        );
      }

      const json = (await res.json()) as LumaCalendarListEventsResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const start_at = toIsoOrUndefined(form.startAtLocal);
      if (!start_at) {
        throw new Error("Please provide a valid start date/time");
      }

      const res = await fetch("/api/luma/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          start_at,
          timezone: form.timezone,
          description_md: form.descriptionMd || undefined,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(
          json?.message || json?.error || "Failed to create event"
        );
      }

      setForm((prev) => ({ ...prev, name: "", startAtLocal: "" }));
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="w-full p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
        <h2 className="text-2xl font-semibold text-neutral-100 mb-4">
          Create Luma Event
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Event name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              placeholder="Builder Vancouver meetup"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Start date/time
              </label>
              <input
                type="datetime-local"
                value={form.startAtLocal}
                onChange={(e) =>
                  setForm({ ...form, startAtLocal: e.target.value })
                }
                className="w-full p-3 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Saved as an ISO timestamp.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Timezone
              </label>
              <input
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="w-full p-3 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                placeholder="America/Vancouver"
              />
              <p className="text-xs text-neutral-500 mt-1">
                IANA timezone (e.g. America/Vancouver).
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">
              Description (Markdown)
            </label>
            <textarea
              value={form.descriptionMd}
              onChange={(e) =>
                setForm({ ...form, descriptionMd: e.target.value })
              }
              rows={6}
              className="w-full p-3 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              placeholder="Agenda, location, speakers..."
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || creating}
            className="w-full px-6 py-3 bg-orange-400 text-neutral-950 font-semibold rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "Creating..." : "Create Event"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-950 border border-red-800 rounded-lg">
            <p className="text-red-400 font-semibold">Error</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        )}
      </div>

      <div className="w-full p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-neutral-100">
            Managed Events
          </h2>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="px-4 py-2 bg-neutral-800 text-neutral-200 rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {!data || data.entries.length === 0 ? (
          <p className="text-neutral-300">
            {loading ? "Loading..." : "No managed events found."}
          </p>
        ) : (
          <div className="space-y-3">
            {data.entries.map((entry) => (
              <div
                key={entry.api_id}
                className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-neutral-100 font-semibold">
                      {entry.event.name}
                    </div>
                    <div className="text-sm text-neutral-400 mt-1">
                      {new Date(entry.event.start_at).toLocaleString()} (
                      {entry.event.timezone})
                    </div>
                  </div>
                  <a
                    href={entry.event.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                  >
                    Open →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
