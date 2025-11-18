"use client";

import type { NewsTopic } from "@/lib/types";

interface TopicPointRendererProps {
  eventTitle: string;
  topic: NewsTopic;
  question: string;
  topicNumber: number;
  totalTopics: number;
  questionNumber: number;
  totalQuestionsInTopic: number;
}

export function TopicPointRenderer({
  eventTitle,
  topic,
  question,
  topicNumber,
  totalTopics,
  questionNumber,
  totalQuestionsInTopic,
}: TopicPointRendererProps) {
  return (
    <div className="w-full max-w-5xl px-6 sm:px-8 lg:px-12">
      {/* Event title - subtle */}
      <div className="text-center mb-8">
        <p className="text-sm text-neutral-500 uppercase tracking-wide">
          {eventTitle}
        </p>
      </div>

      {/* Topic title */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-400 mb-2">
          {topic.title}
        </h2>
        {/* Topic and question counters */}
        <div className="flex items-center justify-center gap-4 text-sm text-neutral-400">
          <span>
            Topic {topicNumber} of {totalTopics}
          </span>
          <span>•</span>
          <span>
            Question {questionNumber} of {totalQuestionsInTopic}
          </span>
        </div>
      </div>

      {/* Main question - large and prominent */}
      <div className="text-center mb-8">
        <p className="text-3xl sm:text-4xl lg:text-5xl font-medium text-neutral-100 leading-relaxed">
          {question}
        </p>
      </div>

      {/* Optional: Topic summary (subtle, smaller) */}
      {topic.summary && (
        <div className="text-center mt-12">
          <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
            {topic.summary}
          </p>
        </div>
      )}

      {/* Optional: Tags */}
      {topic.tags && topic.tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-neutral-800 text-neutral-400 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
