import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Callout } from "@/components/ui/Callout";
import { Heading } from "@/components/ui/Heading";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { QuickStart } from "@/components/ui/QuickStart";
import { Section } from "@/components/ui/Section";

import { loadStackerNewsOnboarding } from "@/lib/content";
import {
  createBreadcrumbList,
  createHowToSchema,
  createSchemaGraph,
  generateMetadata as generateMeta,
} from "@/lib/seo";
import { urls } from "@/lib/utils/urls";

export async function generateMetadata() {
  const content = await loadStackerNewsOnboarding();
  return generateMeta(content.meta, {
    canonicalUrl: urls.guides.stackerNewsOnboarding(),
    type: "article",
  });
}

export default async function StackerNewsOnboardingPage() {
  const content = await loadStackerNewsOnboarding();

  // Generate structured data
  const howToSchema = createHowToSchema({
    title: "How to Set Up Stacker News for Builder Meetups",
    slug: "guides/stacker-news-onboarding",
    description: content.description,
    steps: [
      {
        title: "Download a Lightning Wallet",
        body: "Download Wallet of Satoshi or Phoenix Wallet from your phone's app store.",
      },
      {
        title: "Sign Into Stacker News with Lightning",
        body: "Use your Lightning wallet to authenticate on Stacker News using LNURL.",
      },
      {
        title: "Join Our Meetup Discussion",
        body: "Navigate to the meetup thread and read existing posts.",
      },
      {
        title: "Introduce Yourself & Post",
        body: "Write an introduction and post it to the thread (costs 6 sats).",
      },
      {
        title: "Engage with Others",
        body: "Read other introductions, upvote posts, and reply to others.",
      },
    ],
  });

  const breadcrumbSchema = createBreadcrumbList([
    { name: "Home", url: urls.home() },
    { name: "Guides", url: urls.home() + "/guides" },
    { name: "Stacker News Onboarding" },
  ]);

  const structuredData = createSchemaGraph(howToSchema, breadcrumbSchema);

  // Helper function to check if section is troubleshooting
  const isTroubleshooting = (title: string) =>
    title.toLowerCase().includes("troubleshooting");

  // Helper function to check if section is Quick Start
  const isQuickStart = (title: string) =>
    title.toLowerCase().includes("quick start");

  // Helper function to check if section is final CTA
  const isFinalCTA = (title: string) =>
    title.toLowerCase().includes("you're all set") ||
    title.toLowerCase().includes("ready");

  return (
    <>
      <JsonLd data={structuredData} />
      <PageContainer>
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">⚡</span>
            <Heading level="h1" className="text-orange-400 mb-0">
              {content.title}
            </Heading>
          </div>
          <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
            {content.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#quick-start"
              className="inline-flex items-center justify-center rounded-xl bg-orange-400 px-6 py-3 font-semibold text-neutral-950 hover:bg-orange-300 transition-colors"
            >
              Quick Start ↓
            </a>
            <a
              href="#troubleshooting"
              className="inline-flex items-center justify-center rounded-xl bg-neutral-800 px-6 py-3 font-semibold text-neutral-100 hover:bg-neutral-700 transition-colors border border-neutral-700"
            >
              Need Help?
            </a>
          </div>
        </div>

        {/* Content Sections */}
        {content.sections.map((section, index) => {
          // Render Quick Start section with special styling
          if (isQuickStart(section.title)) {
            return (
              <div key={index} id="quick-start" className="mb-12">
                <QuickStart>
                  <MarkdownContent content={section.body} />
                </QuickStart>
              </div>
            );
          }

          // Render Troubleshooting section with accordion
          if (isTroubleshooting(section.title)) {
            // Parse troubleshooting items from body
            const troubleshootingItems = section.body
              .split("\n\n")
              .filter((item) => item.trim().startsWith('**"'))
              .map((item) => {
                const lines = item.split("\n");
                const question = lines[0]
                  .replace(/^\*\*"/, "")
                  .replace(/"\*\*$/, "");
                const answer = lines.slice(1).join("\n");
                return { question, answer };
              });

            return (
              <div key={index} id="troubleshooting" className="mb-12">
                <Section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">❓</span>
                    <Heading level="h2" className="text-neutral-100 mb-0">
                      {section.title}
                    </Heading>
                  </div>
                  <Accordion>
                    {troubleshootingItems.map((item, idx) => (
                      <AccordionItem
                        key={idx}
                        title={item.question}
                        defaultOpen={idx === 0}
                      >
                        <MarkdownContent content={item.answer} />
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Section>
              </div>
            );
          }

          // Render final CTA section with special styling
          if (isFinalCTA(section.title)) {
            return (
              <Section key={index}>
                <div className="bg-gradient-to-br from-orange-950/30 to-neutral-900 border border-orange-400/20 rounded-xl p-8 text-center">
                  <div className="text-5xl mb-4">🎉</div>
                  <Heading level="h2" className="text-orange-400 mb-4">
                    {section.title}
                  </Heading>
                  <div className="text-neutral-300 mb-8 max-w-2xl mx-auto">
                    <MarkdownContent content={section.body} />
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <a
                      href="https://stacker.news/items/1416761"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-orange-400 px-6 py-3 font-semibold text-neutral-950 hover:bg-orange-300 transition-colors"
                    >
                      Visit Meetup Thread →
                    </a>
                  </div>
                </div>
              </Section>
            );
          }

          // Regular section with step ID
          const stepMatch = section.title.match(/Step (\d+)/i);
          const sectionId = stepMatch ? `step-${stepMatch[1]}` : undefined;

          return (
            <div key={index} id={sectionId} className="mb-12">
              <Section>
                <Heading level="h2" className="text-neutral-100 mb-6">
                  {section.title}
                </Heading>

                <MarkdownContent content={section.body} className="mb-6" />

                {/* Add callout for important notes in specific sections */}
                {section.title.includes("Step 1") && (
                  <Callout type="info">
                    You do NOT need to fund your wallet to sign in to Stacker
                    News. Your Lightning wallet acts like a secure login method
                    - no passwords needed!
                  </Callout>
                )}

                {section.title.includes("Step 4") && (
                  <Callout type="warning">
                    Each post on Stacker News costs a minimum of 6 sats.
                    Don&apos;t have any sats yet? Message me on Luma and
                    I&apos;ll send you some!
                  </Callout>
                )}

                {section.title.includes("Step 5") && (
                  <Callout type="tip">
                    When you upvote posts on Stacker News, you&apos;re actually
                    sending sats to the author! This creates a quality-driven
                    discussion space.
                  </Callout>
                )}

                {section.links && section.links.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-6">
                    {section.links.map((link, linkIndex) =>
                      link.external ? (
                        <a
                          key={linkIndex}
                          href={link.url}
                          className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.text}
                        </a>
                      ) : (
                        <Link
                          key={linkIndex}
                          href={link.url}
                          className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                        >
                          {link.text}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </Section>
            </div>
          );
        })}

        {/* Related Resources Section */}
        <Section>
          <div className="border-t border-neutral-800 pt-12">
            <Heading level="h2" className="text-neutral-100 mb-6">
              Related Resources
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/lightning-101"
                className="block p-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-orange-400/50 transition-colors"
              >
                <div className="font-semibold text-orange-400 mb-2">
                  Lightning 101
                </div>
                <div className="text-sm text-neutral-400">
                  Learn the basics of the Lightning Network
                </div>
              </Link>
              <Link
                href="/lightning-getting-started"
                className="block p-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-orange-400/50 transition-colors"
              >
                <div className="font-semibold text-orange-400 mb-2">
                  Getting Started with Lightning
                </div>
                <div className="text-sm text-neutral-400">
                  Step-by-step guide to using Lightning
                </div>
              </Link>
              <Link
                href="/wallets"
                className="block p-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-orange-400/50 transition-colors"
              >
                <div className="font-semibold text-orange-400 mb-2">
                  Lightning Wallets
                </div>
                <div className="text-sm text-neutral-400">
                  Browse our curated list of Lightning wallets
                </div>
              </Link>
            </div>
          </div>
        </Section>

        {/* Footer Metadata */}
        <Section>
          <div className="text-sm text-neutral-500 border-t border-neutral-800 pt-8">
            <p>Last updated: January 22, 2026</p>
            <p>Guide version: 1.0</p>
          </div>
        </Section>
      </PageContainer>
    </>
  );
}
