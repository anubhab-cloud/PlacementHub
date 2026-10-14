/**
 * Carousel calculation utilities and boundary condition helpers.
 * Ensures zero-shift, strictly bounded slide navigation and accessibility states.
 */

export interface CarouselSlideBounds {
  total: number;
  visible: number;
}

/**
 * Calculates the number of visible cards based on viewport width:
 * Desktop (>= 1024px): 3
 * Tablet (640px - 1023px): 2
 * Mobile (< 640px): 1
 */
export function calculateVisibleCards(width: number): number {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 3;
}

/**
 * Calculates the maximum starting index.
 * If total items <= visible count, maxIndex is 0.
 */
export function calculateMaxIndex(totalItems: number, visibleCount: number): number {
  if (totalItems <= 0 || visibleCount <= 0) return 0;
  return Math.max(0, totalItems - visibleCount);
}

/**
 * Safely clamps an index within [0, maxIndex].
 */
export function clampSlideIndex(index: number, maxIndex: number): number {
  if (maxIndex <= 0) return 0;
  return Math.max(0, Math.min(index, maxIndex));
}

/**
 * Gets next slide index.
 * If loop is enabled, wraps from maxIndex back to 0.
 * If loop is disabled, clamps at maxIndex.
 */
export function getNextSlideIndex(currentIndex: number, maxIndex: number, loop = true): number {
  if (maxIndex <= 0) return 0;
  if (currentIndex >= maxIndex) {
    return loop ? 0 : maxIndex;
  }
  return currentIndex + 1;
}

/**
 * Gets previous slide index.
 * If loop is enabled, wraps from 0 to maxIndex.
 * If loop is disabled, clamps at 0.
 */
export function getPrevSlideIndex(currentIndex: number, maxIndex: number, loop = true): number {
  if (maxIndex <= 0) return 0;
  if (currentIndex <= 0) {
    return loop ? maxIndex : 0;
  }
  return currentIndex - 1;
}

/**
 * Determines whether the carousel should actively rotate or show controls.
 * If total items are fewer than or equal to visible items, carousel controls/autoplay should be inactive.
 */
export function isCarouselInteractive(totalItems: number, visibleCount: number): boolean {
  return totalItems > visibleCount && totalItems > 1;
}

/**
 * Calculates the percentage translation value for the track.
 * Supports custom gap offsets.
 */
export function calculateTrackTransform(currentIndex: number, visibleCount: number): string {
  if (visibleCount <= 0) return 'translateX(0%)';
  const percentage = (currentIndex * 100) / visibleCount;
  return `translateX(-${percentage}%)`;
}
