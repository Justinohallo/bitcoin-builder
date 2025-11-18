"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityDelay = 2500;

  const scheduleOverlayHide = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      setIsOverlayVisible(false);
    }, inactivityDelay);
  }, [inactivityDelay]);

  const handleUserActivity = useCallback(() => {
    setIsOverlayVisible(true);
    scheduleOverlayHide();
  }, [scheduleOverlayHide]);

  useEffect(() => {
    scheduleOverlayHide();
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [scheduleOverlayHide]);

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
        handleUserActivity();
    };

    window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, totalSlides, deckSlug, router, updateSlideIndex, handleUserActivity]);

  // Touch swipe handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
      handleUserActivity();
  };

    const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
      handleUserActivity();
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
      handleUserActivity();
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
        onMouseMove={handleUserActivity}
      >
        {/* Slide content */}
        <div className="h-full w-full flex items-center justify-center">
          <SlideRenderer slide={currentSlide} />
        </div>

        {/* Minimal toast */}
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 text-sm text-neutral-200 bg-neutral-900/90 border border-neutral-800 rounded-full shadow-lg transition-opacity duration-300 ${
            isOverlayVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          Press Esc to exit presentation
        </div>
      </div>
    );
}
