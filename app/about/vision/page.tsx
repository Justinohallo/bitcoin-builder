import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { loadVision } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Builder Vision",
  description: "A world where Bitcoin builders have the tools, knowledge, and community to create the next generation of open financial products.",
  keywords: ["builder", "vision", "bitcoin", "future", "community", "education"],
};

export default function VisionPage() {
  const vision = loadVision();

  return (
    <PageContainer>
      <div className="mb-12">
        <Heading level="h1" className="text-orange-400 mb-4">
          {vision.title}
        </Heading>
        <p className="text-xl text-neutral-300 italic">
          Version {vision.version}
        </p>
      </div>

      <Section>
        <div className="bg-orange-400/10 border border-orange-400/30 rounded-xl p-8 mb-12">
          <p className="text-2xl text-neutral-100 font-medium leading-relaxed">
            {vision.summary}
          </p>
        </div>

        <Heading level="h2" className="text-neutral-100 mb-6">
          The Future We're Building
        </Heading>
        <div className="space-y-4">
          {vision.statements.map((statement, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 bg-neutral-900 border border-neutral-800 rounded-lg"
            >
              <span className="flex-shrink-0 w-8 h-8 bg-orange-400/20 rounded-full flex items-center justify-center text-orange-400 font-bold">
                {index + 1}
              </span>
              <p className="text-lg text-neutral-300 leading-relaxed pt-1">
                {statement}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-4">
          Making It Real
        </Heading>
        <p className="text-lg text-neutral-300 leading-relaxed mb-4">
          This vision guides our long-term strategy. Every Builder chapter, every educational resource, and every tool we create moves us closer to this future.
        </p>
        <p className="text-lg text-neutral-300 leading-relaxed">
          We measure success not just by what we build, but by how many people we empower to build alongside us.
        </p>
      </Section>
    </PageContainer>
  );
}

