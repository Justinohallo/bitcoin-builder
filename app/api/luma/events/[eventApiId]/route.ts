import { NextRequest, NextResponse } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { LumaClient, LumaEventUpdateRequestSchema } from "@/lib/luma";
import { loadLumaConfig } from "@/lib/luma-config";

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
 * GET /api/luma/events/:eventApiId
 * Admin-only: fetch event details.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ eventApiId: string }> }
) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const { eventApiId } = await params;

    const client = new LumaClient(loadLumaConfig());
    const event = await client.getEvent(eventApiId);

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
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
 * PATCH /api/luma/events/:eventApiId
 * Admin-only: update an event.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventApiId: string }> }
) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const { eventApiId } = await params;
    const body = await request.json();

    const payload = LumaEventUpdateRequestSchema.parse({
      ...body,
      event_api_id: eventApiId,
    });

    const client = new LumaClient(loadLumaConfig());
    await client.updateEvent(payload);

    return NextResponse.json({ ok: true }, { status: 200 });
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
