import type { ReactNode } from "react";

type CalloutType = "info" | "tip" | "warning" | "important";

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: ReactNode;
}

/**
 * Callout box component with different visual styles based on type
 * Supports info, tip, warning, and important variants
 */
export function Callout({ type, title, children }: CalloutProps) {
  const config = {
    info: {
      icon: "ℹ️",
      borderColor: "border-l-blue-500",
      bgColor: "bg-blue-500/5",
      titleColor: "text-blue-400",
      defaultTitle: "Important Note",
    },
    tip: {
      icon: "💡",
      borderColor: "border-l-green-500",
      bgColor: "bg-green-500/5",
      titleColor: "text-green-400",
      defaultTitle: "Pro Tip",
    },
    warning: {
      icon: "⚠️",
      borderColor: "border-l-orange-500",
      bgColor: "bg-orange-500/5",
      titleColor: "text-orange-400",
      defaultTitle: "Warning",
    },
    important: {
      icon: "🔴",
      borderColor: "border-l-red-500",
      bgColor: "bg-red-500/5",
      titleColor: "text-red-400",
      defaultTitle: "Important",
    },
  };

  const style = config[type];

  return (
    <div
      className={`border-l-4 ${style.borderColor} ${style.bgColor} rounded-r-lg p-4 my-6`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{style.icon}</span>
        <div className="flex-1">
          {(title || style.defaultTitle) && (
            <div className={`font-semibold ${style.titleColor} mb-2`}>
              {title || style.defaultTitle}
            </div>
          )}
          <div className="text-neutral-300 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
