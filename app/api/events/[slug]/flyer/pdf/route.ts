import { NextRequest, NextResponse } from "next/server";
import { loadEvent } from "@/lib/content";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const event = await loadEvent(slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Get the base URL from the request
    const url = new URL(request.url);
    const protocol = url.protocol || "http:";
    const host = url.host || request.headers.get("host") || "localhost:3000";
    const baseUrl = `${protocol}//${host}`;
    const flyerUrl = `${baseUrl}/events/${slug}/flyer`;

    // Dynamically import playwright only when needed
    const { chromium } = await import("playwright");

    let browser;
    try {
      // Launch browser with better error handling
      browser = await chromium.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      // Set viewport for consistent rendering
      await page.setViewportSize({ width: 816, height: 1056 }); // 8.5x11 inches at 96 DPI

      // Navigate to the flyer page
      await page.goto(flyerUrl, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Wait for content to be fully rendered
      await page.waitForTimeout(1500);

      // Generate PDF with optimized settings
      const pdf = await page.pdf({
        format: "letter",
        margin: {
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
        },
        printBackground: true,
        preferCSSPageSize: false,
      });

      await browser.close();

      // Return PDF as response
      return new NextResponse(pdf as unknown as Blob, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${event.title.replace(/[^a-z0-9]/gi, "_")}_flyer.pdf"`,
        },
      });
    } catch (error) {
      if (browser) {
        await browser.close().catch(() => {
          // Ignore close errors
        });
      }
      console.error("Error generating PDF:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        {
          error: "Failed to generate PDF",
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
