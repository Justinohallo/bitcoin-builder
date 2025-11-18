"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { SlideRenderer } from "./SlideRenderer";
import type { Slide } from "@/lib/types";
import { paths } from "@/lib/utils/urls";

interface PresentationViewProps {
  slides: Slide[];
  deckSlug: string;
}

export function PresentationView({ slides, deckSlug }: PresentationViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Sort slides by order
  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);
  const totalSlides = sortedSlides.length;

  // Initialize state - will be set properly in useEffect
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from URL params or localStorage on mount
  useEffect(() => {
    if (isInitialized) return;

    // First, try URL params
    const slideParam = searchParams.get("slide");
    if (slideParam) {
      const parsed = parseInt(slideParam, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < totalSlides) {
        setCurrentIndex(parsed);
        setIsInitialized(true);
        return;
      }
    }

    // Fallback to localStorage
    const storageKey = `slides-${deckSlug}-index`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < totalSlides) {
          setCurrentIndex(parsed);
          // Update URL to match localStorage
          const url = new URL(window.location.href);
          url.searchParams.set("slide", parsed.toString());
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
  }, [isInitialized, searchParams, deckSlug, totalSlides, router]);

  // Update URL and localStorage when slide changes
  const updateSlideIndex = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= totalSlides) return;
    
    setCurrentIndex(newIndex);
    
    // Update URL without page reload
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("slide", newIndex.toString());
      router.replace(url.pathname + url.search, { scroll: false });
    } catch (e) {
      console.warn("Failed to update URL:", e);
    }
    
    // Update localStorage
    try {
      const storageKey = `slides-${deckSlug}-index`;
      localStorage.setItem(storageKey, newIndex.toString());
    } catch (e) {
      console.warn("Failed to update localStorage:", e);
    }
  }, [totalSlides, deckSlug, router]);

  // Sync with URL params when they change externally (browser back/forward)
  useEffect(() => {
    if (!isInitialized) return;

    const slideParam = searchParams.get("slide");
    if (slideParam) {
      const parsed = parseInt(slideParam, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < totalSlides && parsed !== currentIndex) {
        setCurrentIndex(parsed);
        try {
          const storageKey = `slides-${deckSlug}-index`;
          localStorage.setItem(storageKey, parsed.toString());
        } catch (e) {
          console.warn("Failed to update localStorage:", e);
        }
      }
    }
  }, [searchParams, totalSlides, deckSlug, currentIndex, isInitialized]);

  const currentSlide = sortedSlides[currentIndex];

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
            updateSlideIndex(currentIndex + 1);
          }
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            updateSlideIndex(currentIndex - 1);
          }
          break;
        case "Escape":
          router.push(paths.slides.detail(deckSlug));
          break;
        case "Home":
          updateSlideIndex(0);
          break;
        case "End":
          updateSlideIndex(totalSlides - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalSlides, deckSlug, router, updateSlideIndex]);

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
      updateSlideIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      updateSlideIndex(currentIndex - 1);
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
                updateSlideIndex(currentIndex - 1);
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
                updateSlideIndex(currentIndex + 1);
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
