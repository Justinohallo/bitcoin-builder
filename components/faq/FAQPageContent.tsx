"use client";

import { useState, useMemo } from "react";

import { FAQItem } from "./FAQItem";
import { Heading } from "@/components/ui/Heading";

import type { FAQsCollection } from "@/lib/types";

/**
 * Client component for FAQ page with category filtering and search
 */
export function FAQPageContent({ content }: { content: FAQsCollection }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    let categories = content.categories;

    // Filter by category
    if (selectedCategory) {
      categories = categories.filter((c) => c.id === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      categories = categories
        .map((category) => ({
          ...category,
          faqs: category.faqs.filter(
            (faq) =>
              faq.question.toLowerCase().includes(query) ||
              faq.answer.toLowerCase().includes(query)
          ),
        }))
        .filter((category) => category.faqs.length > 0);
    }

    return categories;
  }, [content.categories, selectedCategory, searchQuery]);

  const allFaqsCount = content.categories.reduce(
    (sum, cat) => sum + cat.faqs.length,
    0
  );

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div>
          <label htmlFor="faq-search" className="sr-only">
            Search FAQs
          </label>
          <input
            id="faq-search"
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === null
                ? "bg-orange-400 text-neutral-950"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
            }`}
          >
            All ({allFaqsCount})
          </button>
          {content.categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-orange-400 text-neutral-950"
                  : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
              }`}
            >
              {category.title} ({category.faqs.length})
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Categories */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-400 text-lg">
            No FAQs found matching your search.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {filteredCategories.map((category) => (
            <div key={category.id}>
              <Heading level="h2" className="text-neutral-100 mb-2">
                {category.title}
              </Heading>
              {category.description && (
                <p className="text-neutral-400 mb-6">{category.description}</p>
              )}
              <div className="space-y-0">
                {category.faqs.map((faq) => (
                  <FAQItem key={faq.id} faq={faq} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
