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
    const baseUrl = `${url.protocol}//${url.host}`;
    const flyerUrl = `${baseUrl}/events/${slug}/flyer`;

    // Dynamically import playwright only when needed
    const { chromium } = await import("playwright");

    // Launch browser
    const browser = await chromium.launch({
      headless: true,
    });

    try {
      const page = await browser.newPage();

      // Navigate to the flyer page
      await page.goto(flyerUrl, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Wait a bit more to ensure all content is rendered
      await page.waitForTimeout(1000);

      // Generate PDF
      const pdf = await page.pdf({
        format: "letter",
        margin: {
          top: "0.5in",
          right: "0.5in",
          bottom: "0.5in",
          left: "0.5in",
        },
        printBackground: true,
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
      await browser.close();
      throw error;
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
