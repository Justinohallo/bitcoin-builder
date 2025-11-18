import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import {
  loadCharter,
  loadCities,
  loadMission,
  loadPhilosophy,
  loadVision,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "About Builder | Foundation & Philosophy",
  description:
    "Discover Builder's mission, vision, charter, and philosophy. Learn about our commitment to building Bitcoin products through open collaboration and structured knowledge.",
  keywords: [
    "builder",
    "mission",
    "vision",
    "charter",
    "philosophy",
    "bitcoin",
    "open source",
    "sovereignty",
  ],
};

export default function AboutPage() {
  const mission = loadMission();
  const vision = loadVision();
  const charter = loadCharter();
  const philosophy = loadPhilosophy();
  const { cities } = loadCities();

  return (
    <PageContainer>
      <div className="mb-16 text-center">
        <Heading level="h1" className="text-orange-400 mb-4">
          About Builder
        </Heading>
        <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
          Builder exists to accelerate the creation of Bitcoin products through
          openness, neutrality, sovereignty, structured knowledge, and
          collaboration.
        </p>
      </div>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-6">
          Our Foundation
        </Heading>
        <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
          These four documents define who we are, what we believe, and how we
          operate. They form the constitutional layer of Builder—immutable
          first-class principles that guide everything we create.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FoundationCard
            title={mission.title}
            summary={mission.summary}
            href="/about/mission"
            theme="Build-First"
          />
          <FoundationCard
            title={vision.title}
            summary={vision.summary}
            href="/about/vision"
            theme="Future-Focused"
          />
          <FoundationCard
            title={charter.title}
            summary="Our pillars and principles for building an open, neutral, and sovereign Bitcoin ecosystem."
            href="/about/charter"
            theme="Principled"
          />
          <FoundationCard
            title={philosophy.title}
            summary="Our approach to education, design, AI, and community-driven progress."
            href="/about/philosophy"
            theme="Thoughtful"
          />
        </div>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-4">
          Why This Matters
        </Heading>
        <p className="text-lg text-neutral-300 leading-relaxed">
          Builder is not just a meetup—it&apos;s a movement to create better
          Bitcoin products through structured knowledge and collaborative
          building. These foundational documents ensure consistency across all
          Builder chapters and provide a clear framework for decision-making,
          content creation, and community engagement.
        </p>
      </Section>

      {cities.length > 0 && (
        <Section>
          <Heading level="h2" className="text-neutral-100 mb-4">
            Builder Cities
          </Heading>
          <p className="text-lg text-neutral-300 mb-6 leading-relaxed">
            Builder operates in cities around the world, each with its own
            vibrant Bitcoin ecosystem. Explore our cities to discover local
            builders, merchants, and communities.
          </p>
          <Link
            href="/cities"
            className="inline-block text-orange-400 hover:text-orange-300 font-medium transition-colors"
          >
            Explore Builder Cities →
          </Link>
        </Section>
      )}
    </PageContainer>
  );
}

interface FoundationCardProps {
  title: string;
  summary: string;
  href: string;
  theme: string;
}

function FoundationCard({ title, summary, href, theme }: FoundationCardProps) {
  return (
    <Link
      href={href}
      className="block p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-orange-400 transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-neutral-100 group-hover:text-orange-400 transition-colors">
          {title}
        </h3>
        <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full">
          {theme}
        </span>
      </div>
      <p className="text-neutral-400 leading-relaxed">{summary}</p>
    </Link>
  );
}
