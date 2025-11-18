import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { loadMembers } from "@/lib/content";
import { generateMetadata as generateMeta } from "@/lib/seo";

export async function generateMetadata() {
  const content = loadMembers();
  return generateMeta(content.meta);
}

export default function MembersPage() {
  const content = loadMembers();

  return (
    <PageContainer>
      <Heading level="h1" className="text-orange-400 mb-4">
        {content.title}
      </Heading>
      <p className="text-xl text-neutral-300 mb-10 max-w-3xl">
        {content.description}
      </p>

      <div className="grid grid-cols-1 gap-8">
        {content.members.map((member) => (
          <Section
            key={member.id}
            className="p-6 border border-neutral-800 rounded-2xl bg-neutral-950"
          >
            <div className="flex flex-col gap-4">
              <div>
                <Heading level="h2" className="text-neutral-100 mb-2">
                  {member.title}
                </Heading>
                <p className="text-orange-300 text-lg">{member.tagline}</p>
              </div>
              <p className="text-neutral-300">{member.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm uppercase tracking-wide text-neutral-500 mb-2">
                    Focus areas
                  </h3>
                  <ul className="space-y-3">
                    {member.focusAreas.map((focus) => (
                      <li key={focus.title}>
                        <p className="font-semibold text-neutral-100">
                          {focus.title}
                        </p>
                        <p className="text-sm text-neutral-400">
                          {focus.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wide text-neutral-500 mb-2">
                    Meetup wins
                  </h3>
                  <ul className="space-y-3">
                    {member.meetupWins.map((win) => (
                      <li key={win.title}>
                        <p className="font-semibold text-neutral-100">
                          {win.title}
                        </p>
                        <p className="text-sm text-neutral-400">
                          {win.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {member.recommendedSessions.slice(0, 2).map((session) => (
                  <Link
                    key={session.title}
                    href={session.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <span>→ {session.title}</span>
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/members/${member.slug}`}
                  className="inline-flex items-center justify-center rounded-xl bg-orange-400 px-5 py-3 font-semibold text-neutral-950 hover:bg-orange-300 transition-colors"
                >
                  View full guide
                </Link>
                <Link
                  href={member.cta.primary.href}
                  className="inline-flex items-center justify-center rounded-xl border border-orange-400 px-5 py-3 font-semibold text-orange-400 hover:text-neutral-950 hover:bg-orange-400 transition-colors"
                >
                  {member.cta.primary.text}
                </Link>
              </div>
            </div>
          </Section>
        ))}
      </div>
    </PageContainer>
  );
}
