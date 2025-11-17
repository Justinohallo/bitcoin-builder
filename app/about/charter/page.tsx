import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { loadCharter } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Builder Charter",
  description: "Our pillars and principles for building an open, neutral, and sovereign Bitcoin ecosystem.",
  keywords: ["builder", "charter", "principles", "pillars", "bitcoin", "sovereignty", "collaboration"],
};

export default function CharterPage() {
  const charter = loadCharter();

  return (
    <PageContainer>
      <div className="mb-12">
        <Heading level="h1" className="text-orange-400 mb-4">
          {charter.title}
        </Heading>
        <p className="text-xl text-neutral-300 italic">
          Version {charter.version}
        </p>
      </div>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-6">
          Our Five Pillars
        </Heading>
        <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
          These pillars define how we operate and what we value. They guide our community interactions, content creation, and product development.
        </p>

        <div className="space-y-6">
          {charter.pillars.map((pillar, index) => (
            <div
              key={index}
              className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl"
            >
              <div className="flex items-start space-x-4">
                <span className="flex-shrink-0 w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center text-neutral-950 font-bold text-lg">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-100 mb-2">
                    {pillar.name}
                  </h3>
                  <p className="text-neutral-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-6">
          Our Operating Principles
        </Heading>
        <p className="text-lg text-neutral-300 mb-6 leading-relaxed">
          These principles inform how we engage with each other and the broader Bitcoin community.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {charter.principles.map((principle, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-4 bg-neutral-900 border border-neutral-800 rounded-lg"
            >
              <span className="text-orange-400 text-xl">✓</span>
              <p className="text-neutral-300 font-medium">{principle}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-4">
          Living the Charter
        </Heading>
        <p className="text-lg text-neutral-300 leading-relaxed">
          The Charter is not a static document—it's a living commitment we uphold through our actions. Every event, every piece of content, and every community interaction should reflect these pillars and principles.
        </p>
      </Section>
    </PageContainer>
  );
}

