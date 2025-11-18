import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadCities, loadHome } from "@/lib/content";
import { generateHomeMetadata } from "@/lib/seo";

export const metadata = generateHomeMetadata();

export default function Home() {
  const content = loadHome();
  const { cities } = loadCities();

  return (
    <PageContainer>
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <Heading level="h1" className="text-orange-400 mb-4">
          {content.hero.heading}
        </Heading>
        <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto">
          {content.hero.subheading}
        </p>
        <Link
          href={content.hero.ctaLink}
          className="inline-block bg-orange-400 text-neutral-950 font-bold px-8 py-3 rounded-xl hover:bg-orange-300 transition-colors"
        >
          {content.hero.ctaText}
        </Link>
      </div>

      {/* Content Sections */}
      {content.sections.map((section, index) => (
        <Section key={index}>
          <Heading level="h2" className="text-neutral-100 mb-4">
            {section.title}
          </Heading>
          <p className="text-lg text-neutral-300 mb-6 leading-relaxed">
            {section.body}
          </p>
          {section.links && section.links.length > 0 && (
            <div className="flex flex-wrap gap-4">
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

      {/* Quick Links Grid */}
      <Section>
        <Heading level="h2" className="text-neutral-100 mb-6">
          Quick Links
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickLinkCard
            title="Events"
            description="View upcoming meetups and workshops"
            href="/events"
          />
          <QuickLinkCard
            title="Bitcoin 101"
            description="Learn Bitcoin basics and fundamentals"
            href="/bitcoin-101"
          />
          <QuickLinkCard
            title="Lightning 101"
            description="Understand the Lightning Network"
            href="/lightning-101"
          />
          <QuickLinkCard
            title="Resources"
            description="Curated learning materials and tools"
            href="/resources"
          />
          <QuickLinkCard
            title="Recaps"
            description="Read about past event highlights"
            href="/recaps"
          />
          <QuickLinkCard
            title="Projects"
            description="Explore community projects"
            href="/projects"
          />
          <QuickLinkCard
            title="Cities"
            description="Explore Bitcoin Builder cities worldwide"
            href="/cities"
          />
        </div>
      </Section>

      {/* Builder Cities Section */}
      {cities.length > 0 && (
        <Section>
          <Heading level="h2" className="text-neutral-100 mb-6">
            Builder Cities
          </Heading>
          <p className="text-lg text-neutral-300 mb-6">
            Builder is a global movement with active chapters in cities around
            the world.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cities.slice(0, 4).map((city) => (
              <Link
                key={city.id}
                href={`/cities/${city.slug}`}
                className="block p-4 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-orange-400 transition-colors group"
              >
                <h3 className="font-bold text-neutral-100 mb-1 group-hover:text-orange-400 transition-colors">
                  {city.name}
                </h3>
                <p className="text-sm text-neutral-400">
                  {city.region}, {city.country}
                </p>
                <p className="text-xs text-neutral-500 mt-2">
                  {city.bitcoinEcosystem.merchantCount} merchants
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/cities"
            className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors"
          >
            View All Cities →
          </Link>
        </Section>
      )}
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
      className="block p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-orange-400 transition-colors group"
    >
      <h3 className="text-xl font-bold text-neutral-100 mb-2 group-hover:text-orange-400 transition-colors">
        {title}
      </h3>
      <p className="text-neutral-400">{description}</p>
    </Link>
  );
}
