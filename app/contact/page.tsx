import { headers } from "next/headers";

import { PageContainer } from "@/components/layout/PageContainer";
import { QRCodeDisplay } from "@/components/contact/QRCodeDisplay";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";

import {
  createBreadcrumbList,
  createSchemaGraph,
} from "@/lib/seo";
import { paths, urls } from "@/lib/utils/urls";

export async function generateMetadata() {
  return {
    title: "Contact | Builder Vancouver",
    description:
      "Connect with Builder Vancouver. Follow us on X, Nostr, and Luma. Scan our QR code to share our website.",
    keywords: ["contact", "builder vancouver", "bitcoin", "connect"],
  };
}

/**
 * Contact page with real-time QR code and social links
 * Optimized for mobile sharing and showcasing work
 */
export default async function ContactPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const protocol = headersList.get("x-forwarded-proto") || "https";
  const currentUrl = `${protocol}://${host}${paths.contact()}`;

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Contact" },
  ]);

  const structuredData = createSchemaGraph(breadcrumbSchema);

  // Social links - update these with actual URLs
  const socialLinks = [
    {
      name: "X (Twitter)",
      href: "https://x.com/builder_van", // Update with actual URL
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "hover:text-neutral-100",
    },
    {
      name: "Nostr",
      href: "https://nostr.com/builder_van", // Update with actual Nostr profile URL or npub
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
      ),
      color: "hover:text-orange-400",
    },
    {
      name: "Luma",
      href: "https://lu.ma/builder-vancouver", // Update with actual Luma URL
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      color: "hover:text-blue-400",
    },
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer className="min-h-screen">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Heading level="h1" className="text-orange-400 mb-4">
            Connect With Us
          </Heading>
          <p className="text-xl text-neutral-300 mb-2">
            Join the Builder Vancouver community
          </p>
          <p className="text-lg text-neutral-400">
            Scan the QR code or follow us on social media
          </p>
        </div>

        {/* QR Code Section - Mobile Optimized */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-8 border border-neutral-700 shadow-2xl">
            <QRCodeDisplay url={currentUrl} />
          </div>
        </div>

        {/* Social Links Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-100 mb-6 text-center">
            Follow Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-all hover:shadow-lg hover:shadow-orange-400/20"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`text-neutral-400 ${social.color} transition-colors mb-4`}>
                    {social.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-100 mb-2 group-hover:text-orange-400 transition-colors">
                    {social.name}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Connect on {social.name}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-8 border border-neutral-700">
          <h2 className="text-2xl font-bold text-neutral-100 mb-6 text-center">
            Get In Touch
          </h2>
          <div className="text-center space-y-4">
            <p className="text-lg text-neutral-300">
              Email us at{" "}
              <a
                href="mailto:bitcoinbuildervan@gmail.com"
                className="font-semibold text-orange-400 underline hover:text-orange-300 transition-colors"
              >
                bitcoinbuildervan@gmail.com
              </a>
            </p>
            <p className="text-sm text-neutral-400">
              We typically respond within 48 hours
            </p>
          </div>
        </div>

        {/* Work Showcase Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-neutral-100 mb-6 text-center">
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-all">
              <h3 className="text-xl font-semibold text-orange-400 mb-3">
                Bitcoin Education
              </h3>
              <p className="text-neutral-300">
                Learn about Bitcoin, Lightning Network, and Layer 2 solutions
                through our educational sessions and workshops.
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-all">
              <h3 className="text-xl font-semibold text-orange-400 mb-3">
                Community Events
              </h3>
              <p className="text-neutral-300">
                Join our regular meetups, presentations, and networking events
                in Vancouver.
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-all">
              <h3 className="text-xl font-semibold text-orange-400 mb-3">
                Open Source
              </h3>
              <p className="text-neutral-300">
                Contribute to Bitcoin-related projects and collaborate with
                builders in the ecosystem.
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-all">
              <h3 className="text-xl font-semibold text-orange-400 mb-3">
                Resources
              </h3>
              <p className="text-neutral-300">
                Access presentations, slides, recaps, and educational materials
                from our community.
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
