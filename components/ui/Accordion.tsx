"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-orange-400 transition-colors group"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-lg pr-4">{title}</span>
        <span className="text-2xl transform transition-transform duration-200 flex-shrink-0 group-hover:text-orange-400">
          {isOpen ? "▼" : "▶"}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[2000px] opacity-100 pb-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-neutral-300 leading-relaxed pl-4">{children}</div>
      </div>
    </div>
  );
}

interface AccordionProps {
  children: ReactNode;
}

export function Accordion({ children }: AccordionProps) {
  return <div className="border-t border-neutral-800">{children}</div>;
}
