import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadMission } from "@/lib/content";

export const metadata: Metadata = {
  title: "Builder Mission Statement",
  description:
    "Accelerate the creation of Bitcoin products by fostering an open, neutral, sovereign, and collaborative builder ecosystem.",
  keywords: [
    "builder",
    "mission",
    "bitcoin",
    "products",
    "collaboration",
    "sovereignty",
  ],
};

export default async function MissionPage() {
  const mission = await loadMission();

  return (
    <PageContainer>
      <div className="mb-12">
        <Heading level="h1" className="text-orange-400 mb-4">
          {mission.title}
        </Heading>
        <p className="text-xl text-neutral-300 italic">
          Version {mission.version}
        </p>
      </div>

      <Section>
        <div className="bg-orange-400/10 border border-orange-400/30 rounded-xl p-8 mb-12">
          <p className="text-2xl text-neutral-100 font-medium leading-relaxed">
            {mission.summary}
          </p>
        </div>

        <div className="space-y-6">
          {mission.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-lg text-neutral-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-4">
          What This Means
        </Heading>
        <p className="text-lg text-neutral-300 leading-relaxed mb-4">
          Our mission drives every decision we make. From the workshops we host
          to the tools we build, everything serves one purpose: helping people
          create real Bitcoin products.
        </p>
        <p className="text-lg text-neutral-300 leading-relaxed">
          We focus on practical skills, structured documentation, and open
          collaboration—because better tools and better knowledge lead to better
          sovereignty.
        </p>
      </Section>
    </PageContainer>
  );
}
