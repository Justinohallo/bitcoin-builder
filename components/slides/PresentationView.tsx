"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SlideRenderer } from "./SlideRenderer";
import type { Slide } from "@/lib/types";
import { paths } from "@/lib/utils/urls";

interface PresentationViewProps {
  slides: Slide[];
  deckSlug: string;
}

export function PresentationView({ slides, deckSlug }: PresentationViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  // Sort slides by order
  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);
  const currentSlide = sortedSlides[currentIndex];
  const totalSlides = sortedSlides.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowRight":
        case " ": // Spacebar
          if (currentIndex < totalSlides - 1) {
            setCurrentIndex(currentIndex + 1);
          }
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          }
          break;
        case "Escape":
          router.push(paths.slides.detail(deckSlug));
          break;
        case "Home":
          setCurrentIndex(0);
          break;
        case "End":
          setCurrentIndex(totalSlides - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalSlides, deckSlug, router]);

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

    if (isLeftSwipe && currentIndex < totalSlides - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentSlide) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <p className="text-neutral-400">No slides available</p>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-neutral-950 overflow-hidden z-50"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide content */}
      <div className="h-full w-full flex items-center justify-center pb-24">
        <SlideRenderer slide={currentSlide} />
      </div>

      {/* Navigation controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900/80 backdrop-blur-sm border-t border-neutral-800 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
              }
            }}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <div className="text-neutral-400 text-sm sm:text-base">
            Slide {currentIndex + 1} of {totalSlides}
          </div>

          <button
            onClick={() => {
              if (currentIndex < totalSlides - 1) {
                setCurrentIndex(currentIndex + 1);
              }
            }}
            disabled={currentIndex === totalSlides - 1}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Exit button */}
      <button
        onClick={() => router.push(paths.slides.detail(deckSlug))}
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
