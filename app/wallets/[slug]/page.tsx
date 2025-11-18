import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadWallet, loadWallets } from "@/lib/content";
import {
  createBreadcrumbList,
  createSchemaGraph,
  createWebPageSchema,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { paths, urls } from "@/lib/utils/urls";

interface WalletPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { wallets } = await loadWallets();
  return wallets.map((wallet) => ({
    slug: wallet.slug,
  }));
}

export async function generateMetadata({ params }: WalletPageProps) {
  const { slug } = await params;
  const wallet = await loadWallet(slug);

  if (!wallet) {
    return {};
  }

  return generateMeta(wallet.meta);
}

function PlatformBadge({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    iOS: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Android: "bg-green-500/20 text-green-300 border-green-500/30",
    Desktop: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Web: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  };

  return (
    <span
      className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${colors[platform] || "bg-neutral-800 text-neutral-300 border-neutral-700"}`}
    >
      {platform}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    custodial: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    "non-custodial": "bg-green-500/20 text-green-300 border-green-500/30",
    hybrid: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };

  const labels: Record<string, string> = {
    custodial: "Custodial",
    "non-custodial": "Non-Custodial",
    hybrid: "Hybrid",
  };

  return (
    <span
      className={`px-4 py-2 text-sm font-semibold rounded-full border ${colors[type] || "bg-neutral-800 text-neutral-300 border-neutral-700"}`}
    >
      {labels[type] || type}
    </span>
  );
}

export default async function WalletDetailPage({ params }: WalletPageProps) {
  const { slug } = await params;
  const wallet = await loadWallet(slug);

  if (!wallet) {
    notFound();
  }

  // Generate structured data
  const webPageSchema = createWebPageSchema(
    urls.wallets.detail(wallet.slug),
    wallet.meta.title,
    wallet.description
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Wallets", url: urls.wallets.list() },
    { name: wallet.name },
  ]);

  const structuredData = createSchemaGraph(webPageSchema, breadcrumbSchema);

  const platforms = [];
  if (wallet.platforms.ios) platforms.push("iOS");
  if (wallet.platforms.android) platforms.push("Android");
  if (wallet.platforms.desktop) platforms.push("Desktop");
  if (wallet.platforms.web) platforms.push("Web");

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Link
          href={paths.wallets.list()}
          className="inline-flex items-center text-orange-400 hover:text-orange-300 mb-6 transition-colors"
        >
          ← Back to all wallets
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <Heading level="h1" className="text-orange-400 mb-2">
              {wallet.name}
            </Heading>
            <p className="text-xl text-neutral-300">{wallet.description}</p>
          </div>
          <TypeBadge type={wallet.type} />
        </div>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Platform Availability
          </Heading>
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <PlatformBadge key={platform} platform={platform} />
            ))}
          </div>
        </Section>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Download
          </Heading>
          <div className="flex flex-wrap gap-4">
            {wallet.downloadLinks.ios && (
              <a
                href={wallet.downloadLinks.ios}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-.96-1.15 0-1.93.46-2.93.96-1.01.5-1.75.58-2.73.05-.98-.53-4.28-1.47-4.28-5.5 0-4.03 3.23-5.95 3.23-5.95 1.61-1.15 3.78-1.25 5.03-1.25.25 0 .5.01.75.01.25 0 .5.01.75.01 1.25 0 3.42.1 5.03 1.25 0 0 3.23 1.92 3.23 5.95 0 4.03-3.3 4.97-4.28 5.5-.98.53-1.72.45-2.73-.05-.99-.5-1.78-.96-2.93-.96-1.16 0-2.15.46-3.24.96-1.03.48-2.1.55-3.08-.4-.98-.95-1.47-2.47-1.47-4.28 0-1.81.49-3.33 1.47-4.28.98-.95 2.05-.88 3.08-.4 1.09.5 2.08.96 3.24.96 1.15 0 1.93-.46 2.93-.96 1.01-.5 1.75-.58 2.73-.05.98.53 4.28 1.47 4.28 5.5 0 4.03-3.23 5.95-3.23 5.95z" />
                </svg>
                App Store
              </a>
            )}
            {wallet.downloadLinks.android && (
              <a
                href={wallet.downloadLinks.android}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm4.95-4.95l-2.27 2.27L21.34 6.05l-2.27 2.27-2.27-2.27L17.05 3.66l2.27 2.27L21.66 3.66l2.27 2.27-2.27 2.27z" />
                </svg>
                Google Play
              </a>
            )}
            {wallet.downloadLinks.desktop && (
              <a
                href={wallet.downloadLinks.desktop}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
              >
                Download Desktop
              </a>
            )}
            {wallet.downloadLinks.website && (
              <a
                href={wallet.downloadLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-700 hover:border-orange-400 text-neutral-300 hover:text-orange-400 rounded-lg font-medium transition-colors"
              >
                Visit Website
              </a>
            )}
            {wallet.website &&
              wallet.website !== wallet.downloadLinks.website && (
                <a
                  href={wallet.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-700 hover:border-orange-400 text-neutral-300 hover:text-orange-400 rounded-lg font-medium transition-colors"
                >
                  Official Website
                </a>
              )}
          </div>
        </Section>

        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Features
          </Heading>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {wallet.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-neutral-300"
              >
                <span className="text-orange-400 mt-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </Section>

        {wallet.sections && wallet.sections.length > 0 && (
          <>
            {wallet.sections.map((section, index) => (
              <Section key={index}>
                <Heading level="h2" className="text-neutral-100 mb-4">
                  {section.title}
                </Heading>
                <div className="text-lg text-neutral-300 whitespace-pre-line leading-relaxed">
                  {section.body}
                </div>
                {section.links && section.links.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {section.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.url}
                        className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                        {...(link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.text}
                      </Link>
                    ))}
                  </div>
                )}
              </Section>
            ))}
          </>
        )}

        {(wallet.twitter || wallet.github) && (
          <Section>
            <Heading level="h2" className="text-neutral-100 mb-4">
              Links
            </Heading>
            <div className="flex flex-wrap gap-4">
              {wallet.website && (
                <a
                  href={wallet.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Website ↗
                </a>
              )}
              {wallet.twitter && (
                <a
                  href={`https://twitter.com/${wallet.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Twitter ↗
                </a>
              )}
              {wallet.github && (
                <a
                  href={wallet.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </Section>
        )}

        <Section>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <Heading level="h2" className="text-neutral-100 mb-4">
              New to Lightning?
            </Heading>
            <p className="text-neutral-300 mb-4">
              Check out our Getting Started guide to learn how to install a
              wallet, receive your first payment, and send Lightning payments.
            </p>
            <Link
              href={paths.education.lightningGettingStarted()}
              className="inline-flex items-center text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Read Getting Started Guide →
            </Link>
          </div>
        </Section>
      </PageContainer>
    </>
  );
}
