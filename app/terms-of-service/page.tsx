import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata(
  "Terms of Service | Builder Vancouver",
  "Review the terms that govern your participation in Builder Vancouver events, online programs, and community resources.",
  ["terms of service", "builder vancouver", "community guidelines", "bitcoin"]
);

export default function TermsOfServicePage() {
  return (
    <PageContainer>
      <Heading level="h1" className="text-orange-400 mb-6">
        Terms of Service
      </Heading>
      <p className="text-lg text-neutral-300 mb-10 leading-relaxed max-w-3xl">
        These terms govern your use of Builder Vancouver&apos;s website,
        community resources, and events. By participating, you agree to follow
        these guidelines to keep the experience welcoming, safe, and productive.
      </p>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-4">
          Community Standards
        </Heading>
        <ul className="list-disc list-inside space-y-2 text-neutral-300">
          <li>
            Be respectful, inclusive, and constructive in all interactions.
          </li>
          <li>No harassment, discrimination, or disruptive behavior.</li>
          <li>
            Follow event-specific rules, instructions, and safety guidance.
          </li>
          <li>
            Share accurate information and cite sources when teaching or
            presenting.
          </li>
        </ul>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-4">
          Use of Content
        </Heading>
        <ul className="list-disc list-inside space-y-2 text-neutral-300">
          <li>
            You may use public resources for personal learning and community
            building.
          </li>
          <li>
            Do not redistribute proprietary or restricted materials without
            permission.
          </li>
          <li>
            Respect speaker and contributor rights for presentations, slides,
            and recordings.
          </li>
        </ul>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-4">
          Liability &amp; Conduct
        </Heading>
        <ul className="list-disc list-inside space-y-2 text-neutral-300">
          <li>
            Participation is at your own risk; please evaluate tools and advice
            before use.
          </li>
          <li>
            Organizers may revoke access for violations of these terms or
            harmful behavior.
          </li>
          <li>
            Services are provided &quot;as is&quot; without warranties of any
            kind.
          </li>
        </ul>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-4">
          Contact
        </Heading>
        <p className="text-neutral-300 leading-relaxed">
          Questions about these terms? Email{" "}
          <a
            href="mailto:hello@builder.van"
            className="text-orange-400 hover:text-orange-300 transition-colors"
          >
            hello@builder.van
          </a>{" "}
          and we&apos;ll help you out.
        </p>
      </Section>
    </PageContainer>
  );
}
