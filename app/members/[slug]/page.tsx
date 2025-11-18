import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadMember, loadMembers } from "@/lib/content";
import { generateMetadata as generateMeta } from "@/lib/seo";
import type { MemberResource } from "@/lib/types";
import { urls } from "@/lib/utils/urls";

interface MemberPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { members } = loadMembers();
  return members.map((member) => ({
    slug: member.slug,
  }));
}

export async function generateMetadata({ params }: MemberPageProps) {
  const { slug } = await params;
  const member = loadMember(slug);

  if (!member) {
    return {};
  }

  const description = member.summary;
  const title = `${member.title} | Builder Member Persona`;

  return generateMeta({
    title,
    description,
    keywords: [
      member.title,
      "Builder Vancouver",
      "Lightning Network workshop",
      "Bitcoin community",
    ],
  });
}

const RESOURCE_TYPE_LABELS: Record<MemberResource["type"], string> = {
  event: "Events & Workshops",
  presentation: "Presentations",
  project: "Projects to Join",
  news: "Research & Briefings",
  resource: "Technical References",
  guide: "Guides & Checklists",
  video: "Videos",
  blog: "Articles & Blogs",
  tool: "Tools",
};

export default async function MemberDetailPage({ params }: MemberPageProps) {
  const { slug } = await params;
  const member = loadMember(slug);

  if (!member) {
    notFound();
  }

  const resourcesByType = member.resources.reduce<
    Record<MemberResource["type"], MemberResource[]>
  >(
    (acc, resource) => {
      if (!acc[resource.type]) {
        acc[resource.type] = [];
      }
      acc[resource.type].push(resource);
      return acc;
    },
    {} as Record<MemberResource["type"], MemberResource[]>
  );

  return (
    <PageContainer>
      <Link
        href="/members"
        className="inline-flex items-center text-orange-400 hover:text-orange-300 mb-6 transition-colors"
      >
        ← Back to member personas
      </Link>

      <Heading level="h1" className="text-orange-400 mb-4">
        {member.title}
      </Heading>
      <p className="text-lg text-neutral-300 mb-4">{member.tagline}</p>
      <p className="text-xl text-neutral-200 mb-10 max-w-4xl leading-relaxed">
        {member.summary}
      </p>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-6">
          How Builder accelerates you
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {member.focusAreas.map((focus) => (
            <article
              key={focus.title}
              className="p-5 border border-neutral-800 rounded-xl bg-neutral-900"
            >
              <h3 className="text-xl font-semibold text-neutral-100 mb-2">
                {focus.title}
              </h3>
              <p className="text-neutral-300">{focus.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-6">
          Wins you can claim at each meetup
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {member.meetupWins.map((win) => (
            <article
              key={win.title}
              className="p-5 border border-neutral-800 rounded-xl bg-neutral-950"
            >
              <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                {win.title}
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                {win.description}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-6">
          Recommended sessions & deep dives
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {member.recommendedSessions.map((session) => (
            <article
              key={session.title}
              className="p-6 border border-neutral-800 rounded-xl bg-neutral-900 flex flex-col gap-3"
            >
              <h3 className="text-xl font-semibold text-neutral-100">
                {session.title}
              </h3>
              <p className="text-neutral-300">{session.description}</p>
              <Link
                href={session.href}
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                Explore →
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <Heading level="h2" className="text-neutral-100 mb-6">
          Resources you can act on
        </Heading>
        <div className="space-y-8">
          {Object.entries(resourcesByType).map(([type, resources]) => (
            <div key={type} className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-300">
                {RESOURCE_TYPE_LABELS[type as MemberResource["type"]] ?? type}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource) => (
                  <article
                    key={resource.title}
                    className="p-5 border border-neutral-800 rounded-xl bg-neutral-950 hover:border-orange-400 transition-colors"
                  >
                    {resource.external ? (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex flex-col gap-2"
                      >
                        <span className="text-base font-semibold text-neutral-100 group-hover:text-orange-400 transition-colors">
                          {resource.title} ↗
                        </span>
                        <span className="text-sm text-neutral-400">
                          {resource.description}
                        </span>
                      </a>
                    ) : (
                      <Link
                        href={resource.url}
                        className="group inline-flex flex-col gap-2"
                      >
                        <span className="text-base font-semibold text-neutral-100 group-hover:text-orange-400 transition-colors">
                          {resource.title}
                        </span>
                        <span className="text-sm text-neutral-400">
                          {resource.description}
                        </span>
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap gap-4">
          <Link
            href={member.cta.primary.href}
            className="inline-flex items-center justify-center rounded-xl bg-orange-400 px-6 py-3 font-semibold text-neutral-950 hover:bg-orange-300 transition-colors"
          >
            {member.cta.primary.text}
          </Link>
          {member.cta.secondary && (
            <Link
              href={member.cta.secondary.href}
              className="inline-flex items-center justify-center rounded-xl border border-orange-400 px-6 py-3 font-semibold text-orange-400 hover:text-neutral-950 hover:bg-orange-400 transition-colors"
            >
              {member.cta.secondary.text}
            </Link>
          )}
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
          <Link
            href={urls.events.list()}
            className="hover:text-orange-400 transition-colors"
          >
            Upcoming events →
          </Link>
          <Link
            href={urls.resources()}
            className="hover:text-orange-400 transition-colors"
          >
            Browse resources →
          </Link>
        </div>
      </Section>
    </PageContainer>
  );
}
