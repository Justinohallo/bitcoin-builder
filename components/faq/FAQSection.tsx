import type { FAQItem as FAQItemType } from "@/lib/types";

import { FAQItem } from "./FAQItem";

interface FAQSectionProps {
  faqs: FAQItemType[];
  title?: string;
  limit?: number;
  showAll?: boolean;
}

/**
 * Reusable FAQ section component for displaying FAQs on various pages
 */
export function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  limit,
  showAll = false,
}: FAQSectionProps) {
  const displayFaqs = limit && !showAll ? faqs.slice(0, limit) : faqs;

  if (displayFaqs.length === 0) {
    return null;
  }

  return (
    <section className="my-12">
      {title && (
        <h2 className="text-2xl font-bold text-neutral-100 mb-6">{title}</h2>
      )}
      <div className="space-y-0">
        {displayFaqs.map((faq) => (
          <FAQItem key={faq.id} faq={faq} />
        ))}
      </div>
      {limit && faqs.length > limit && !showAll && (
        <div className="mt-6 text-center">
          <a
            href="/faq"
            className="text-orange-400 hover:text-orange-300 underline transition-colors"
          >
            View all FAQs →
          </a>
        </div>
      )}
    </section>
  );
}
