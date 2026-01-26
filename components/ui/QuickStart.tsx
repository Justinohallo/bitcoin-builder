import type { ReactNode } from "react";

import { Heading } from "./Heading";

interface QuickStartProps {
  title?: string;
  children: ReactNode;
}

/**
 * Highlighted Quick Start section component
 * Features a cream/yellow background to make it stand out
 */
export function QuickStart({
  title = "Quick Start Guide",
  children,
}: QuickStartProps) {
  return (
    <div className="bg-amber-50/5 border-2 border-amber-500/30 rounded-lg p-6 sm:p-8 mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🚀</span>
        <Heading level="h2" className="text-amber-400 mb-0">
          {title}
        </Heading>
      </div>
      <div className="border-t border-amber-500/20 mb-6"></div>
      <div className="text-lg text-neutral-300 leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  );
}
