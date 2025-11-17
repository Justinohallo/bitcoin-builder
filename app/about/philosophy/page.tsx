import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { loadPhilosophy } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Builder Philosophy",
  description: "Our approach to education, design, AI, and community-driven progress in the Bitcoin ecosystem.",
  keywords: ["builder", "philosophy", "education", "design", "ux", "ai", "community", "bitcoin"],
};

export default function PhilosophyPage() {
  const philosophy = loadPhilosophy();

  return (
    <PageContainer>
      <div className="mb-12">
        <Heading level="h1" className="text-orange-400 mb-4">
          {philosophy.title}
        </Heading>
        <p className="text-xl text-neutral-300 italic">
          Version {philosophy.version}
        </p>
      </div>

      <Section>
        <p className="text-xl text-neutral-300 mb-12 leading-relaxed">
          Our philosophy shapes how we think about building, teaching, and collaborating. These themes influence every aspect of Builder's approach.
        </p>

        <div className="space-y-8">
          {philosophy.themes.map((theme, index) => (
            <div
              key={index}
              className="p-8 bg-neutral-900 border border-neutral-800 rounded-xl"
            >
              <div className="flex items-start space-x-4 mb-4">
                <span className="flex-shrink-0 w-12 h-12 bg-orange-400/20 rounded-xl flex items-center justify-center text-orange-400 font-bold text-xl">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-neutral-100 mb-2">
                    {theme.name}
                  </h3>
                  <p className="text-lg text-orange-400 italic">
                    {theme.summary}
                  </p>
                </div>
              </div>
              <p className="text-neutral-300 leading-relaxed pl-16">
                {theme.details}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-4">
          Philosophy in Practice
        </Heading>
        <div className="space-y-4">
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
            <h3 className="text-lg font-bold text-neutral-100 mb-2">
              Structured Content
            </h3>
            <p className="text-neutral-300 leading-relaxed">
              All Builder content is stored in structured JSON format, making it consumable by both humans and AI. This enables remixing, reuse, and programmatic content generation.
            </p>
          </div>
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
            <h3 className="text-lg font-bold text-neutral-100 mb-2">
              Progressive Learning
            </h3>
            <p className="text-neutral-300 leading-relaxed">
              We start with 101-level content and build toward mastery. Each piece of educational material connects to the next, creating clear learning paths.
            </p>
          </div>
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
            <h3 className="text-lg font-bold text-neutral-100 mb-2">
              Community-First Development
            </h3>
            <p className="text-neutral-300 leading-relaxed">
              Every tool we build, every event we host, and every resource we create is shaped by community feedback and real builder needs.
            </p>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
}

