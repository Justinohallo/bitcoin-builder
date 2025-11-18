import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadWallets } from "@/lib/content";
import {
  createBreadcrumbList,
  createSchemaGraph,
  createWebPageSchema,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { paths, urls } from "@/lib/utils/urls";

export async function generateMetadata() {
  const content = await loadWallets();
  return generateMeta(content.meta);
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
      className={`px-2 py-1 text-xs font-medium rounded border ${colors[platform] || "bg-neutral-800 text-neutral-300 border-neutral-700"}`}
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
      className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors[type] || "bg-neutral-800 text-neutral-300 border-neutral-700"}`}
    >
      {labels[type] || type}
    </span>
  );
}

export default async function WalletsPage() {
  const content = await loadWallets();

  // Generate structured data
  const webPageSchema = createWebPageSchema(
    urls.wallets.list(),
    content.title,
    content.description
  );

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Wallets" },
  ]);

  const structuredData = createSchemaGraph(webPageSchema, breadcrumbSchema);

  const platforms = (wallet: (typeof content.wallets)[0]) => {
    const result: string[] = [];
    if (wallet.platforms.ios) result.push("iOS");
    if (wallet.platforms.android) result.push("Android");
    if (wallet.platforms.desktop) result.push("Desktop");
    if (wallet.platforms.web) result.push("Web");
    return result;
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        <Heading level="h1" className="text-orange-400 mb-4">
          {content.title}
        </Heading>
        <p className="text-xl text-neutral-300 mb-12 max-w-3xl">
          {content.description}
        </p>

        <Section>
          <div className="mb-6">
            <Link
              href={paths.education.lightningGettingStarted()}
              className="inline-flex items-center text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              ← New to Lightning? Start with our Getting Started guide
            </Link>
          </div>
        </Section>

        <Section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.wallets.map((wallet) => {
              const walletPlatforms = platforms(wallet);
              return (
                <Link
                  key={wallet.id}
                  href={paths.wallets.detail(wallet.slug)}
                  className="group block p-6 border border-neutral-800 rounded-xl bg-neutral-950 hover:border-orange-400/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Heading
                      level="h2"
                      className="text-neutral-100 group-hover:text-orange-400 transition-colors"
                    >
                      {wallet.name}
                    </Heading>
                    <TypeBadge type={wallet.type} />
                  </div>

                  <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                    {wallet.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {walletPlatforms.map((platform) => (
                      <PlatformBadge key={platform} platform={platform} />
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                    {wallet.features.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="text-neutral-500">
                        {feature}
                      </span>
                    ))}
                    {wallet.features.length > 2 && (
                      <span className="text-neutral-500">
                        +{wallet.features.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="mt-4 text-orange-400 text-sm font-medium group-hover:text-orange-300 transition-colors">
                    Learn more →
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>

        <Section>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <Heading level="h2" className="text-neutral-100 mb-4">
              Need Help Choosing?
            </Heading>
            <p className="text-neutral-300 mb-4">
              Not sure which wallet is right for you? Our Getting Started guide
              explains the differences between custodial and non-custodial
              wallets, and helps you choose based on your needs.
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
