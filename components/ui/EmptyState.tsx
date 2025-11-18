import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Empty state component for displaying when there's no data
 * Provides consistent styling and messaging across the app
 */
export function EmptyState({
  title,
  message,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      {icon && (
        <div className="mb-6 text-6xl opacity-50">{icon}</div>
      )}
      {title && (
        <h3 className="text-xl font-semibold text-neutral-200 mb-3">
          {title}
        </h3>
      )}
      <p className="text-neutral-400 text-lg max-w-md mb-6">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
