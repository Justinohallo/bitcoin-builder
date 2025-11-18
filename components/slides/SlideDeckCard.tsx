"use client";

import Link from "next/link";

import { Heading } from "@/components/ui/Heading";
import type { SlideDeck } from "@/lib/types";
import { paths } from "@/lib/utils/urls";

interface SlideDeckCardProps {
  deck: SlideDeck;
}

export function SlideDeckCard({ deck }: SlideDeckCardProps) {
  const slideCount = deck.slides.length;
  const updatedDate = new Date(deck.updatedAt).toLocaleDateString();

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-400 transition-colors">
      <Link href={paths.slides.detail(deck.slug)}>
        <Heading level="h3" className="text-neutral-100 mb-2 hover:text-orange-400 transition-colors">
          {deck.title}
        </Heading>
      </Link>

      <p className="text-neutral-300 mb-4 line-clamp-2">{deck.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-neutral-400 mb-4">
        <p>📊 {slideCount} {slideCount === 1 ? "slide" : "slides"}</p>
        <p>📅 Updated {updatedDate}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href={paths.slides.present(deck.slug)}
          className="inline-block px-4 py-2 bg-orange-400 text-neutral-950 font-medium rounded-lg hover:bg-orange-300 transition-colors"
        >
          View Presentation →
        </Link>
        <Link
          href={paths.slides.detail(deck.slug)}
          className="inline-block px-4 py-2 border border-neutral-700 text-neutral-300 font-medium rounded-lg hover:border-orange-400 hover:text-orange-400 transition-colors"
        >
          Edit
        </Link>
        <button
          className="px-4 py-2 border border-red-700 text-red-400 font-medium rounded-lg hover:border-red-600 hover:text-red-300 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            // Delete functionality to be implemented
            if (confirm(`Are you sure you want to delete "${deck.title}"?`)) {
              // TODO: Implement delete
              console.log("Delete:", deck.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
