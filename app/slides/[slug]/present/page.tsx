import { Suspense } from "react";
import { notFound } from "next/navigation";

import { PresentationView } from "@/components/slides/PresentationView";
import { loadSlideDeck, loadSlides } from "@/lib/content";
import { generatePageMetadata } from "@/lib/seo";

interface PresentationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PresentationPageProps) {
  const { slug } = await params;
  const deck = await loadSlideDeck(slug);

  if (!deck) {
    return {};
  }

  return generatePageMetadata(
    `${deck.title} - Presentation | Builder Vancouver`,
    deck.description,
    ["slides", "presentation", ...(deck.meta.keywords || [])]
  );
}

export async function generateStaticParams() {
  const { slideDecks } = await loadSlides();
  return slideDecks.map((deck) => ({
    slug: deck.slug,
  }));
}

export default async function PresentationPage({
  params,
}: PresentationPageProps) {
  const { slug } = await params;
  const deck = await loadSlideDeck(slug);

  if (!deck) {
    notFound();
  }

  if (deck.slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">This slide deck has no slides.</p>
          <a
            href={`/slides/${slug}`}
            className="text-orange-400 hover:text-orange-300"
          >
            Go back to edit
          </a>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <p className="text-neutral-400">Loading presentation...</p>
      </div>
    }>
      <PresentationView slides={deck.slides} deckSlug={deck.slug} />
    </Suspense>
  );
}
