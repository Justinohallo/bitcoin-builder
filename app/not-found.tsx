import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

/**
 * Custom 404 Not Found page
 * Provides helpful navigation and maintains the site's design system
 */
export default function NotFound() {
  return (
    <PageContainer>
      <div className="text-center py-16 sm:py-24">
        {/* 404 Number Display */}
        <div className="mb-8">
          <Heading level="h1" className="text-orange-400 mb-4">
            404
          </Heading>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-4">
            Page Not Found
          </p>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            The page you're looking for seems to have vanished into the mempool.
            Let's get you back on track.
          </p>
        </div>

        {/* Main CTA */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-block bg-orange-400 text-neutral-950 font-bold px-8 py-3 rounded-xl hover:bg-orange-300 transition-colors mb-4"
          >
            Return Home
          </Link>
        </div>

        {/* Quick Links Section */}
        <Section>
          <Heading level="h2" className="text-neutral-100 mb-6">
            Popular Pages
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <QuickLinkCard
              title="Events"
              description="View upcoming meetups"
              href="/events"
            />
            <QuickLinkCard
              title="Bitcoin 101"
              description="Learn Bitcoin basics"
              href="/bitcoin-101"
            />
            <QuickLinkCard
              title="Lightning 101"
              description="Understand Lightning"
              href="/lightning-101"
            />
            <QuickLinkCard
              title="Resources"
              description="Learning materials"
              href="/resources"
            />
            <QuickLinkCard
              title="Cities"
              description="Builder cities worldwide"
              href="/cities"
            />
            <QuickLinkCard
              title="Members"
              description="Community personas"
              href="/members"
            />
          </div>
        </Section>

        {/* Helpful Message */}
        <Section>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-neutral-300 mb-4">
              If you believe this is an error, you can:
            </p>
            <ul className="text-left text-neutral-400 space-y-2 max-w-md mx-auto">
              <li className="flex items-start">
                <span className="text-orange-400 mr-2">•</span>
                <span>Check the URL for typos</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-2">•</span>
                <span>Use the navigation menu to browse</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-2">•</span>
                <span>Return to the homepage and explore</span>
              </li>
            </ul>
          </div>
        </Section>
      </div>
    </PageContainer>
  );
}

interface QuickLinkCardProps {
  title: string;
  description: string;
  href: string;
}

function QuickLinkCard({ title, description, href }: QuickLinkCardProps) {
  return (
    <Link
      href={href}
      className="block p-5 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-orange-400 transition-colors group text-left"
    >
      <h3 className="text-lg font-bold text-neutral-100 mb-2 group-hover:text-orange-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-neutral-400">{description}</p>
    </Link>
  );
}
