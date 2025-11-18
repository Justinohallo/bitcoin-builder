import Link from "next/link";

import type { ScheduleItem } from "@/lib/types";
import type { Presenter } from "@/lib/types";
import type { Presentation } from "@/lib/types";

interface ScheduleProps {
  items: ScheduleItem[];
  presentersById?: Map<string, Presenter>;
  presentationsById?: Map<string, Presentation>;
}

/**
 * Get icon for schedule item type
 */
function getTypeIcon(type?: ScheduleItem["type"]) {
  switch (type) {
    case "presentation":
      return "🎤";
    case "workshop":
      return "🔧";
    case "break":
      return "☕";
    case "networking":
      return "🤝";
    case "q-and-a":
      return "❓";
    case "introduction":
      return "👋";
    case "closing":
      return "👋";
    default:
      return "📋";
  }
}

/**
 * Get color classes for schedule item type
 */
function getTypeColorClasses(type?: ScheduleItem["type"]) {
  switch (type) {
    case "presentation":
      return "border-orange-400/50 bg-orange-400/10";
    case "workshop":
      return "border-orange-500/50 bg-orange-500/10";
    case "break":
      return "border-neutral-600/50 bg-neutral-800/50";
    case "networking":
      return "border-blue-400/50 bg-blue-400/10";
    case "q-and-a":
      return "border-purple-400/50 bg-purple-400/10";
    case "introduction":
    case "closing":
      return "border-green-400/50 bg-green-400/10";
    default:
      return "border-neutral-700/50 bg-neutral-800/30";
  }
}

/**
 * Format time display
 */
function formatTime(time: string): string {
  // If already in readable format (contains AM/PM), return as-is
  if (time.includes("AM") || time.includes("PM") || time.includes("am") || time.includes("pm")) {
    return time;
  }
  
  // Otherwise, assume 24-hour format and convert
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes || "00"} ${ampm}`;
}

/**
 * Format time range
 */
function formatTimeRange(startTime: string, endTime?: string): string {
  const start = formatTime(startTime);
  if (!endTime) return start;
  const end = formatTime(endTime);
  return `${start} - ${end}`;
}

/**
 * Schedule component with timeline visualization
 * Displays event schedule items in a vertical timeline format
 */
export function Schedule({
  items,
  presentersById = new Map(),
  presentationsById = new Map(),
}: ScheduleProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const presenter = item.presenterId
          ? presentersById.get(item.presenterId)
          : undefined;
        const presentation = item.presentationId
          ? presentationsById.get(item.presentationId)
          : undefined;

        return (
          <div
            key={index}
            className={`relative flex gap-4 p-4 rounded-lg border ${getTypeColorClasses(
              item.type
            )} transition-all hover:border-opacity-100`}
          >
            {/* Timeline indicator */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-12 text-center">
                <div className="text-sm font-semibold text-orange-400">
                  {formatTime(item.startTime)}
                </div>
                {item.endTime && (
                  <div className="text-xs text-neutral-400 mt-1">
                    {formatTime(item.endTime)}
                  </div>
                )}
              </div>
              {index < items.length - 1 && (
                <div className="w-0.5 h-full bg-neutral-700 mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-xl flex-shrink-0">
                  {getTypeIcon(item.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-100 mb-1">
                    {presentation ? (
                      <Link
                        href={`/presentations/${presentation.slug}`}
                        className="hover:text-orange-400 transition-colors"
                      >
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </h3>
                  {item.description && (
                    <p className="text-neutral-300 mb-2">{item.description}</p>
                  )}
                  {presenter && (
                    <p className="text-sm text-neutral-400 mb-1">
                      Presented by{" "}
                      <Link
                        href={`/presenters/${presenter.slug}`}
                        className="text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        {presenter.name}
                      </Link>
                      {presenter.title && (
                        <span className="text-neutral-500">
                          {" "}
                          - {presenter.title}
                        </span>
                      )}
                    </p>
                  )}
                  {presentation && presentation.duration && (
                    <p className="text-xs text-neutral-500 mt-1">
                      ⏱️ {presentation.duration}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
