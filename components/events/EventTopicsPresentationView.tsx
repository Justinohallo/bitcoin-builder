"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { TopicPointRenderer } from "./TopicPointRenderer";
import type { NewsTopic } from "@/lib/types";
import { paths } from "@/lib/utils/urls";

interface FlattenedPoint {
  topicIndex: number;
  questionIndex: number;
  topic: NewsTopic;
  question: string;
}

interface EventTopicsPresentationViewProps {
  eventTitle: string;
  eventSlug: string;
  topics: NewsTopic[];
}

export function EventTopicsPresentationView({
  eventTitle,
  eventSlug,
  topics,
}: EventTopicsPresentationViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Flatten all questions from all topics into sequential points
  const flattenedPoints = useMemo<FlattenedPoint[]>(() => {
    const points: FlattenedPoint[] = [];
    topics.forEach((topic, topicIndex) => {
      if (topic.questions && topic.questions.length > 0) {
        topic.questions.forEach((question, questionIndex) => {
          points.push({
            topicIndex,
            questionIndex,
            topic,
            question,
          });
        });
      }
    });
    return points;
  }, [topics]);

  const totalPoints = flattenedPoints.length;

  // Initialize state - will be set properly in useEffect
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from URL params or localStorage on mount
  useEffect(() => {
    if (isInitialized) return;

    // First, try URL params
    const pointParam = searchParams.get("point");
    if (pointParam) {
      const parsed = parseInt(pointParam, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < totalPoints) {
        setCurrentIndex(parsed);
        setIsInitialized(true);
        return;
      }
    }

    // Fallback to localStorage
    const storageKey = `event-${eventSlug}-point-index`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < totalPoints) {
          setCurrentIndex(parsed);
          // Update URL to match localStorage
          const url = new URL(window.location.href);
          url.searchParams.set("point", parsed.toString());
          router.replace(url.pathname + url.search, { scroll: false });
          setIsInitialized(true);
          return;
        }
      }
    } catch (e) {
      // localStorage might not be available
      console.warn("localStorage not available:", e);
    }

    setIsInitialized(true);
  }, [isInitialized, searchParams, eventSlug, totalPoints, router]);

  // Update URL and localStorage when point changes
  const updatePointIndex = useCallback(
    (newIndex: number) => {
      if (newIndex < 0 || newIndex >= totalPoints) return;

      setCurrentIndex(newIndex);

      // Update URL without page reload
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("point", newIndex.toString());
        router.replace(url.pathname + url.search, { scroll: false });
      } catch (e) {
        console.warn("Failed to update URL:", e);
      }

      // Update localStorage
      try {
        const storageKey = `event-${eventSlug}-point-index`;
        localStorage.setItem(storageKey, newIndex.toString());
      } catch (e) {
        console.warn("Failed to update localStorage:", e);
      }
    },
    [totalPoints, eventSlug, router]
  );

  // Sync with URL params when they change externally (browser back/forward)
  useEffect(() => {
    if (!isInitialized) return;

    const pointParam = searchParams.get("point");
    if (pointParam) {
      const parsed = parseInt(pointParam, 10);
      if (
        !isNaN(parsed) &&
        parsed >= 0 &&
        parsed < totalPoints &&
        parsed !== currentIndex
      ) {
        setCurrentIndex(parsed);
        try {
          const storageKey = `event-${eventSlug}-point-index`;
          localStorage.setItem(storageKey, parsed.toString());
        } catch (e) {
          console.warn("Failed to update localStorage:", e);
        }
      }
    }
  }, [searchParams, totalPoints, eventSlug, currentIndex, isInitialized]);

  const currentPoint = flattenedPoints[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === " "
      ) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowRight":
        case " ": // Spacebar
          if (currentIndex < totalPoints - 1) {
            updatePointIndex(currentIndex + 1);
          }
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            updatePointIndex(currentIndex - 1);
          }
          break;
        case "Escape":
          router.push(paths.events.detail(eventSlug));
          break;
        case "Home":
          updatePointIndex(0);
          break;
        case "End":
          updatePointIndex(totalPoints - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalPoints, eventSlug, router, updatePointIndex]);

  // Touch swipe handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < totalPoints - 1) {
      updatePointIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      updatePointIndex(currentIndex - 1);
    }
  };

  if (!currentPoint) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <p className="text-neutral-400">No discussion points available</p>
      </div>
    );
  }

  // Calculate progress info
  const currentTopicIndex = currentPoint.topicIndex;
  const currentQuestionIndex = currentPoint.questionIndex;
  const currentTopic = currentPoint.topic;
  const questionsInCurrentTopic = currentTopic.questions?.length || 0;
  
  // Count total questions in each topic up to current topic
  let questionCountBeforeCurrentTopic = 0;
  for (let i = 0; i < currentTopicIndex; i++) {
    questionCountBeforeCurrentTopic += topics[i].questions?.length || 0;
  }

  return (
    <div
      className="fixed inset-0 bg-neutral-950 overflow-hidden z-50"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Content */}
      <div className="h-full w-full flex items-center justify-center pb-24">
        <TopicPointRenderer
          eventTitle={eventTitle}
          topic={currentTopic}
          question={currentPoint.question}
          topicNumber={currentTopicIndex + 1}
          totalTopics={topics.length}
          questionNumber={currentQuestionIndex + 1}
          totalQuestionsInTopic={questionsInCurrentTopic}
        />
      </div>

      {/* Navigation controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900/80 backdrop-blur-sm border-t border-neutral-800 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                updatePointIndex(currentIndex - 1);
              }
            }}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <div className="text-neutral-400 text-sm sm:text-base">
            Point {currentIndex + 1} of {totalPoints}
          </div>

          <button
            onClick={() => {
              if (currentIndex < totalPoints - 1) {
                updatePointIndex(currentIndex + 1);
              }
            }}
            disabled={currentIndex === totalPoints - 1}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Exit button */}
      <button
        onClick={() => router.push(paths.events.detail(eventSlug))}
        className="fixed top-4 right-4 px-4 py-2 bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-800 hover:text-orange-400 transition-colors"
        aria-label="Exit presentation"
      >
        ✕ Exit
      </button>

      {/* Keyboard hints (hidden on mobile) */}
      <div className="hidden md:block fixed top-4 left-4 text-xs text-neutral-600 space-y-1">
        <div>← → Navigate</div>
        <div>ESC Exit</div>
      </div>
    </div>
  );
}
