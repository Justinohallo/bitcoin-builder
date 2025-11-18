"use client";

import { useState } from "react";

import Link from "next/link";

import type { FAQItem as FAQItemType } from "@/lib/types";
import { paths } from "@/lib/utils/urls";

interface FAQItemProps {
  faq: FAQItemType;
  defaultOpen?: boolean;
}

/**
 * Individual FAQ item component with expandable answer
 */
export function FAQItem({ faq, defaultOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const sourceUrl = faq.sourceContent
    ? paths.page(faq.sourceContent.slug) +
      (faq.sourceContent.anchor ? `#${faq.sourceContent.anchor}` : "")
    : null;

  return (
    <div className="border-b border-neutral-800 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-start justify-between gap-4 group"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
      >
        <h3 className="text-lg font-medium text-neutral-100 group-hover:text-orange-400 transition-colors flex-1">
          {faq.question}
        </h3>
        <svg
          className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          id={`faq-answer-${faq.id}`}
          className="mt-4 text-neutral-300 leading-relaxed"
        >
          <div className="whitespace-pre-line mb-4">{faq.answer}</div>
          {sourceUrl && faq.sourceContent && (
            <div className="text-sm">
              <span className="text-neutral-500">Learn more: </span>
              <Link
                href={sourceUrl}
                className="text-orange-400 hover:text-orange-300 underline transition-colors"
              >
                {faq.sourceContent.title}
              </Link>
            </div>
          )}
          {faq.relatedFaqs && faq.relatedFaqs.length > 0 && (
            <div className="text-sm mt-2 text-neutral-500">
              Related questions: {faq.relatedFaqs.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
