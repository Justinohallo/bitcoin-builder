import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata(
  "Privacy Policy | Builder Vancouver",
  "Learn how Builder Vancouver collects, uses, and protects your information across events, community programs, and online experiences.",
  [
    "privacy policy",
    "data protection",
    "builder vancouver",
    "bitcoin community",
  ]
);

export default function PrivacyPolicyPage() {
  return (
    <PageContainer>
      <Heading level="h1" className="text-orange-400 mb-6">
        Privacy Policy
      </Heading>
      <p className="text-lg text-neutral-300 mb-10 leading-relaxed max-w-3xl">
        We take your privacy seriously. This policy explains what information we
        collect, how we use it, and the choices you have when engaging with
        Builder Vancouver.
      </p>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-4">
          Information We Collect
        </Heading>
        <ul className="list-disc list-inside space-y-2 text-neutral-300">
          <li>Account details when you sign in or register for events.</li>
          <li>Contact information you share for newsletters or updates.</li>
          <li>
            Participation data from workshops, meetups, and online programs.
          </li>
          <li>Technical data such as device type and basic analytics.</li>
        </ul>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-4">
          How We Use Your Data
        </Heading>
        <ul className="list-disc list-inside space-y-2 text-neutral-300">
          <li>To provide event updates, reminders, and follow-ups.</li>
          <li>To personalize learning resources and community programs.</li>
          <li>
            To improve site performance, accessibility, and member experience.
          </li>
          <li>To comply with legal requirements and platform policies.</li>
        </ul>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-4">
          Your Choices
        </Heading>
        <ul className="list-disc list-inside space-y-2 text-neutral-300">
          <li>Update or delete your account information at any time.</li>
          <li>Opt out of marketing emails or community announcements.</li>
          <li>Request a copy of the data associated with your account.</li>
        </ul>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-4">
          Contact Us
        </Heading>
        <p className="text-neutral-300 leading-relaxed">
          If you have questions about this policy or how we handle your data,
          please reach out to our organizers at{" "}
          <a
            href="mailto:privacy@builder.van"
            className="text-orange-400 hover:text-orange-300 transition-colors"
          >
            privacy@builder.van
          </a>
          .
        </p>
      </Section>
    </PageContainer>
  );
}
