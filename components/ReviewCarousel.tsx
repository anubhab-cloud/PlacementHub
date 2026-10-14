'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import {
  calculateVisibleCards,
  calculateMaxIndex,
  clampSlideIndex,
  getNextSlideIndex,
  getPrevSlideIndex,
  isCarouselInteractive,
} from '@/lib/carousel-utils';

export interface ReviewData {
  id?: string;
  quote: string;
  initial: string;
  name: string;
  role: string;
  rating?: number;
  /** Indicates whether the testimonial has been verified by the placement portal */
  verified?: boolean;
}

/**
 * Testimonial Data Source:
 * Contains candidate feedback from university students.
 * Marked with verified: false until confirmed via production student portal authentication.
 */
export const DEFAULT_REVIEWS: ReviewData[] = [
  {
    id: 'rev-arghadeep',
    quote: 'The readiness score told me what to fix before my Amazon OA. Super clear.',
    initial: 'A',
    name: 'Arghadeep',
    role: 'NIT Agartala (NIT A)',
    rating: 5,
    verified: false,
  },
  {
    id: 'rev-debjeet',
    quote: 'Study rooms keep me consistent. Quiet, focused, and nobody bothers you.',
    initial: 'D',
    name: 'Debjeet',
    role: 'VIT Bhopal (VIT B)',
    rating: 5,
    verified: false,
  },
  {
    id: 'rev-atanu',
    quote: 'The AI coach pushed me on graphs until I stopped dreading them.',
    initial: 'A',
    name: 'Atanu',
    role: 'Assam University',
    rating: 5,
    verified: false,
  },
];

interface ReviewCarouselProps {
  reviews?: ReviewData[];
  autoplayInterval?: number; // In milliseconds (default 5500ms = 5.5s)
}

export default function ReviewCarousel({
  reviews = DEFAULT_REVIEWS,
  autoplayInterval = 5500,
}: ReviewCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [manualPause, setManualPause] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  // Detect prefers-reduced-motion media query
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
      return () => mediaQuery.removeListener(listener);
    }
  }, []);

  // Responsive card calculation: 3 desktop (>= 1024), 2 tablet (640-1023), 1 mobile (< 640)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const count = calculateVisibleCards(width);
      setVisibleCards(count);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalReviews = reviews.length;
  const maxIndex = calculateMaxIndex(totalReviews, visibleCards);
  const isInteractive = isCarouselInteractive(totalReviews, visibleCards);

  // Keep currentIndex bounded if visibleCards changes
  useEffect(() => {
    setCurrentIndex((prev) => clampSlideIndex(prev, maxIndex));
  }, [maxIndex]);

  // Slide navigation callbacks
  const handleNext = useCallback(() => {
    if (!isInteractive) return;
    setCurrentIndex((prev) => getNextSlideIndex(prev, maxIndex, true));
  }, [isInteractive, maxIndex]);

  const handlePrev = useCallback(() => {
    if (!isInteractive) return;
    setCurrentIndex((prev) => getPrevSlideIndex(prev, maxIndex, true));
  }, [isInteractive, maxIndex]);

  const handleGoTo = useCallback((index: number) => {
    setCurrentIndex(clampSlideIndex(index, maxIndex));
  }, [maxIndex]);

  // Autoplay management: pauses on hover, focus, touch interaction, manual toggle, or reduced-motion
  const isAutoplayActive =
    isInteractive &&
    !isHovered &&
    !isFocused &&
    !isDragging &&
    !manualPause &&
    !prefersReducedMotion;

  useEffect(() => {
    if (!isAutoplayActive) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [isAutoplayActive, autoplayInterval, handleNext]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isInteractive) return;
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        handlePrev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleNext();
        break;
      case 'Home':
        e.preventDefault();
        handleGoTo(0);
        break;
      case 'End':
        e.preventDefault();
        handleGoTo(maxIndex);
        break;
      default:
        break;
    }
  };

  // Touch & Swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    // Track horizontal swipe if dominant
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      touchDeltaX.current = deltaX;
    }
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 40) {
      if (touchDeltaX.current < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    touchDeltaX.current = 0;
    setIsDragging(false);
  };

  // Pagination indicators count: (maxIndex + 1)
  const pageCount = maxIndex + 1;

  // Track transform calculation:
  // Using CSS variable expression: calc(-1 * currentIndex * (100% + var(--carousel-gap)) / var(--carousel-visible))
  const trackStyle: React.CSSProperties = {
    transform: isInteractive
      ? `translateX(calc(-1 * ${currentIndex} * (100% + var(--carousel-gap, 22px)) / var(--carousel-visible, ${visibleCards})))`
      : 'translateX(0%)',
    transition: prefersReducedMotion ? 'none' : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
  };

  return (
    <div
      ref={containerRef}
      className="homepage-carousel-container"
      role="region"
      aria-roledescription="carousel"
      aria-label="Student testimonials"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      aria-live={isHovered || isFocused ? 'polite' : 'off'}
    >
      {/* Screen-reader live update */}
      <div className="sr-only" aria-atomic="true">
        Showing reviews {currentIndex + 1} to{' '}
        {Math.min(currentIndex + visibleCards, totalReviews)} of {totalReviews}
      </div>

      {/* Overflow-hidden carousel viewport */}
      <div className="homepage-carousel-viewport">
        <div
          className="homepage-carousel-track"
          style={trackStyle}
        >
          {reviews.map((review, index) => {
            const isSlideVisible =
              !isInteractive ||
              (index >= currentIndex && index < currentIndex + visibleCards);

            return (
              <div
                key={review.id || `${review.name}-${index}`}
                className="homepage-carousel-slide"
                style={{
                  flex: `0 0 calc((100% - (var(--carousel-visible, ${visibleCards}) - 1) * var(--carousel-gap, 22px)) / var(--carousel-visible, ${visibleCards}))`,
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${totalReviews}: ${review.name}`}
                aria-hidden={!isSlideVisible}
              >
                <article className="homepage-carousel-card">
                  <div className="homepage-stars" aria-label={`${review.rating || 5} out of 5 stars`}>
                    ★★★★★
                  </div>
                  <p>“{review.quote}”</p>
                  <div className="homepage-review-author">
                    <span>{review.initial}</span>
                    <div>
                      <b>{review.name}</b>
                      <small>{review.role}</small>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessible Carousel Navigation & Pagination Bar */}
      <div className="homepage-carousel-controls" aria-label="Carousel navigation">
        {/* Previous Button */}
        <button
          type="button"
          className="homepage-carousel-nav-btn"
          onClick={handlePrev}
          disabled={!isInteractive}
          aria-disabled={!isInteractive}
          aria-label="Previous testimonials"
          title={isInteractive ? 'Previous (Left Arrow)' : 'No additional reviews to display'}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>

        {/* Pagination Indicators */}
        <div className="homepage-carousel-pagination" role="tablist" aria-label="Slide indicators">
          {Array.from({ length: pageCount }).map((_, pageIdx) => {
            const isActive = currentIndex === pageIdx;
            return (
              <button
                key={pageIdx}
                type="button"
                role="tab"
                disabled={!isInteractive}
                className={`homepage-carousel-dot ${isActive ? 'is-active' : ''}`}
                aria-selected={isActive}
                aria-label={
                  isInteractive
                    ? `Go to slide ${pageIdx + 1} of ${pageCount}`
                    : 'Current testimonials view'
                }
                onClick={() => handleGoTo(pageIdx)}
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          className="homepage-carousel-nav-btn"
          onClick={handleNext}
          disabled={!isInteractive}
          aria-disabled={!isInteractive}
          aria-label="Next testimonials"
          title={isInteractive ? 'Next (Right Arrow)' : 'No additional reviews to display'}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>

        {/* Autoplay Pause / Play Toggle for screen readers and accessibility */}
        {isInteractive && (
          <button
            type="button"
            className="homepage-carousel-pause-btn"
            onClick={() => setManualPause((prev) => !prev)}
            aria-label={manualPause ? 'Resume carousel autoplay' : 'Pause carousel autoplay'}
            title={manualPause ? 'Play Autoplay' : 'Pause Autoplay'}
          >
            {manualPause ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
}
