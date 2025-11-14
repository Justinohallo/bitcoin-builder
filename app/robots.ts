import type { MetadataRoute } from "next";

/**
 * Robots.txt configuration for Builder Vancouver
 * Controls search engine crawling and sitemap location
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://builder.van";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

