import { NextRequest, NextResponse } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { LumaClient, LumaEventCreateRequestSchema } from "@/lib/luma";
import { loadLumaConfig } from "@/lib/luma-config";

const ListManagedEventsQuerySchema = z.object({
  after: z.string().optional(),
  before: z.string().optional(),
  pagination_cursor: z.string().optional(),
  pagination_limit: z.coerce.number().int().positive().optional(),
  sort_column: z.string().optional(),
  sort_direction: z.string().optional(),
});

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  const user = await currentUser();
  const userRole = user?.publicMetadata?.role as string | undefined;
  const isAdmin = userRole === "admin" || userRole === "super_admin";

  if (!isAdmin) {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          error: "Forbidden",
          message:
            "Admin access required. Please ensure your user has 'admin' or 'super_admin' role set in Clerk public metadata.",
        },
        { status: 403 }
      ),
    };
  }

  return { ok: true as const };
}

/**
 * GET /api/luma/events
 * Admin-only: list events managed by the Luma Calendar associated with the API key.
 */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const url = new URL(request.url);
    const query = ListManagedEventsQuerySchema.parse(
      Object.fromEntries(url.searchParams.entries())
    );

    const client = new LumaClient(loadLumaConfig());
    const result = await client.listManagedEvents({
      ...query,
      revalidateSeconds: 0,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/luma/events
 * Admin-only: create an event in Luma.
 */
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const body = await request.json();
    const payload = LumaEventCreateRequestSchema.parse(body);

    const client = new LumaClient(loadLumaConfig());
    const created = await client.createEvent(payload);

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
