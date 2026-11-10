import { z } from "zod";

import type { LumaConfig } from "./luma-config";

export class LumaApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "LumaApiError";
  }
}

const IsoDateTimeStringSchema = z
  .string()
  .min(1)
  .describe("ISO 8601 date-time string");

const NullableStringSchema = z.string().nullable();

export const LumaEventSchema = z.object({
  id: z.string(),
  calendar_id: z.string(),
  user_id: z.string(),

  name: z.string(),
  description: z.string(),
  description_md: z.string(),

  start_at: IsoDateTimeStringSchema,
  end_at: IsoDateTimeStringSchema,
  created_at: IsoDateTimeStringSchema,
  duration_interval: z.string(),
  timezone: z.string(),

  url: z.string().url(),
  cover_url: z.string(),

  meeting_url: NullableStringSchema,

  geo_latitude: z.number().nullable(),
  geo_longitude: z.number().nullable(),

  geo_address_json: z
    .object({
      address: z.string().optional(),
      city: NullableStringSchema.optional(),
      region: NullableStringSchema.optional(),
      country: NullableStringSchema.optional(),
      city_state: NullableStringSchema.optional(),
      full_address: NullableStringSchema.optional(),
    })
    .nullable(),

  visibility: z.enum(["public", "private", "unlisted"]).or(z.string()),

  // Deprecated but still returned by the API
  api_id: z.string(),
  calendar_api_id: z.string(),
  user_api_id: z.string(),

  zoom_meeting_url: NullableStringSchema,
});

export type LumaEvent = z.infer<typeof LumaEventSchema>;

export const LumaCalendarListEventsResponseSchema = z.object({
  entries: z.array(
    z.object({
      api_id: z.string(),
      event: LumaEventSchema,
    })
  ),
  has_more: z.boolean(),
  next_cursor: z.string().nullable(),
});

export type LumaCalendarListEventsResponse = z.infer<
  typeof LumaCalendarListEventsResponseSchema
>;

export const LumaEventGetResponseSchema = z.object({
  event: LumaEventSchema,
  hosts: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        avatar_url: z.string().optional(),
      })
    )
    .optional(),
});

export type LumaEventGetResponse = z.infer<typeof LumaEventGetResponseSchema>;

export const LumaEventCreateRequestSchema = z.object({
  name: z.string().min(1),
  start_at: IsoDateTimeStringSchema,
  timezone: z.string().min(1),

  description_md: z.string().optional(),
  end_at: IsoDateTimeStringSchema.optional(),
  meeting_url: z.string().url().optional(),
  cover_url: z.string().optional(),
  visibility: z.enum(["public", "private", "unlisted"]).optional(),
  slug: z.string().min(1).optional(),
});

export type LumaEventCreateRequest = z.infer<
  typeof LumaEventCreateRequestSchema
>;

export const LumaEventCreateResponseSchema = z.object({
  api_id: z.string(),
});

export type LumaEventCreateResponse = z.infer<
  typeof LumaEventCreateResponseSchema
>;

export const LumaEventUpdateRequestSchema = z.object({
  event_api_id: z.string().min(1),

  name: z.string().min(1).optional(),
  start_at: IsoDateTimeStringSchema.optional(),
  end_at: IsoDateTimeStringSchema.optional(),
  timezone: z.string().min(1).optional(),

  description_md: z.string().optional(),
  meeting_url: z.string().url().optional(),
  cover_url: z.string().optional(),
  visibility: z.enum(["public", "private", "unlisted"]).optional(),
  slug: z.string().min(1).optional(),
});

export type LumaEventUpdateRequest = z.infer<
  typeof LumaEventUpdateRequestSchema
>;

export type LumaRequestOptions = {
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  cache?: RequestCache;
  revalidateSeconds?: number;
};

export class LumaClient {
  constructor(private config: LumaConfig) {}

  private get baseUrl(): string {
    return this.config.baseUrl.replace(/\/$/, "");
  }

  private get apiKey(): string | undefined {
    return this.config.apiKey;
  }

  private async request<T>(
    method: "GET" | "POST",
    path: string,
    options: LumaRequestOptions = {}
  ): Promise<T> {
    if (!this.apiKey) {
      throw new LumaApiError(
        "Luma API key not configured (set LUMA_API_KEY)",
        500
      );
    }

    const url = new URL(`${this.baseUrl}${path}`);
    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value === undefined || value === null) continue;
        url.searchParams.set(key, String(value));
      }
    }

    const res = await fetch(url.toString(), {
      method,
      headers: {
        "content-type": "application/json",
        "x-luma-api-key": this.apiKey,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: options.cache,
      next:
        typeof options.revalidateSeconds === "number"
          ? { revalidate: options.revalidateSeconds }
          : undefined,
    });

    const text = await res.text();
    const json = text ? safeJsonParse(text) : null;

    if (!res.ok) {
      throw new LumaApiError(
        `Luma API request failed: ${method} ${path} (${res.status})`,
        res.status,
        json ?? text
      );
    }

    return json as T;
  }

  async getSelf(): Promise<unknown> {
    return this.request("GET", "/v1/user/get-self", {
      cache: "no-store",
    });
  }

  async listManagedEvents(params?: {
    after?: string;
    before?: string;
    pagination_cursor?: string;
    pagination_limit?: number;
    sort_column?: string;
    sort_direction?: string;
    revalidateSeconds?: number;
  }): Promise<LumaCalendarListEventsResponse> {
    const json = await this.request<unknown>(
      "GET",
      "/v1/calendar/list-events",
      {
        query: params,
        revalidateSeconds: params?.revalidateSeconds,
      }
    );

    return LumaCalendarListEventsResponseSchema.parse(json);
  }

  async getEvent(eventApiId: string): Promise<LumaEventGetResponse> {
    const json = await this.request<unknown>("GET", "/v1/event/get", {
      query: { api_id: eventApiId },
      cache: "no-store",
    });

    return LumaEventGetResponseSchema.parse(json);
  }

  async createEvent(
    payload: LumaEventCreateRequest
  ): Promise<LumaEventCreateResponse> {
    const body = LumaEventCreateRequestSchema.parse(payload);
    const json = await this.request<unknown>("POST", "/v1/event/create", {
      body,
      cache: "no-store",
    });

    return LumaEventCreateResponseSchema.parse(json);
  }

  async updateEvent(payload: LumaEventUpdateRequest): Promise<void> {
    const body = LumaEventUpdateRequestSchema.parse(payload);
    await this.request("POST", "/v1/event/update", {
      body,
      cache: "no-store",
    });
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
