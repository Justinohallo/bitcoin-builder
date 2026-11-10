import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { PageContainer } from "@/components/layout/PageContainer";
import { LumaEventsManager } from "@/components/luma/LumaEventsManager";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Luma Events | Builder Vancouver",
  "Create and manage Luma events from the Builder Vancouver app.",
  ["luma", "events", "management"]
);

export default async function LumaPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  return (
    <PageContainer>
      <Heading level="h1" className="text-orange-400 mb-4">
        Luma Events
      </Heading>
      <Section>
        <p className="text-lg text-neutral-300 mb-6">
          Create and manage events on your Luma Calendar. This page requires a
          signed-in Clerk user with an admin role.
        </p>
        <LumaEventsManager />
      </Section>
    </PageContainer>
  );
}
