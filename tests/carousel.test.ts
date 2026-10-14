import { describe, it, expect } from 'vitest';
import {
  calculateVisibleCards,
  calculateMaxIndex,
  clampSlideIndex,
  getNextSlideIndex,
  getPrevSlideIndex,
  isCarouselInteractive,
} from '@/lib/carousel-utils';

describe('Carousel Calculation Utilities & Boundary Conditions', () => {
  describe('calculateVisibleCards', () => {
    it('returns 1 card on mobile viewports (< 640px)', () => {
      expect(calculateVisibleCards(320)).toBe(1);
      expect(calculateVisibleCards(375)).toBe(1);
      expect(calculateVisibleCards(639)).toBe(1);
    });

    it('returns 2 cards on tablet viewports (640px - 1023px)', () => {
      expect(calculateVisibleCards(640)).toBe(2);
      expect(calculateVisibleCards(768)).toBe(2);
      expect(calculateVisibleCards(1023)).toBe(2);
    });

    it('returns 3 cards on desktop viewports (>= 1024px)', () => {
      expect(calculateVisibleCards(1024)).toBe(3);
      expect(calculateVisibleCards(1280)).toBe(3);
      expect(calculateVisibleCards(1920)).toBe(3);
    });
  });

  describe('calculateMaxIndex & Boundary Handling', () => {
    it('handles too few reviews gracefully (<= visible count)', () => {
      // 3 items with 3 visible cards on desktop
      expect(calculateMaxIndex(3, 3)).toBe(0);
      // 2 items with 3 visible cards on desktop
      expect(calculateMaxIndex(2, 3)).toBe(0);
      // 1 item with 3 visible cards on desktop
      expect(calculateMaxIndex(1, 3)).toBe(0);
      // Empty items
      expect(calculateMaxIndex(0, 3)).toBe(0);
    });

    it('calculates correct maxIndex when total > visible', () => {
      // 6 items on desktop (3 visible) -> maxIndex is 3 (slides 0, 1, 2, 3)
      expect(calculateMaxIndex(6, 3)).toBe(3);
      // 6 items on tablet (2 visible) -> maxIndex is 4
      expect(calculateMaxIndex(6, 2)).toBe(4);
      // 6 items on mobile (1 visible) -> maxIndex is 5
      expect(calculateMaxIndex(6, 1)).toBe(5);
    });

    it('clamps indices strictly within [0, maxIndex]', () => {
      expect(clampSlideIndex(-2, 3)).toBe(0);
      expect(clampSlideIndex(2, 3)).toBe(2);
      expect(clampSlideIndex(5, 3)).toBe(3);
      expect(clampSlideIndex(2, 0)).toBe(0);
    });
  });

  describe('getNextSlideIndex & getPrevSlideIndex', () => {
    it('handles forward progression and looping at last item', () => {
      // Normal step
      expect(getNextSlideIndex(0, 3, true)).toBe(1);
      expect(getNextSlideIndex(2, 3, true)).toBe(3);
      // Looping at boundary
      expect(getNextSlideIndex(3, 3, true)).toBe(0);
      // Non-looping clamped at boundary
      expect(getNextSlideIndex(3, 3, false)).toBe(3);
    });

    it('handles backward progression and looping at first item', () => {
      // Normal step
      expect(getPrevSlideIndex(2, 3, true)).toBe(1);
      // Looping at boundary
      expect(getPrevSlideIndex(0, 3, true)).toBe(3);
      // Non-looping clamped at boundary
      expect(getPrevSlideIndex(0, 3, false)).toBe(0);
    });

    it('returns 0 when maxIndex is 0 (too few items to scroll)', () => {
      expect(getNextSlideIndex(0, 0, true)).toBe(0);
      expect(getPrevSlideIndex(0, 0, true)).toBe(0);
      expect(getNextSlideIndex(0, 0, false)).toBe(0);
      expect(getPrevSlideIndex(0, 0, false)).toBe(0);
    });
  });

  describe('isCarouselInteractive', () => {
    it('returns false when items are fewer than or equal to visible cards', () => {
      expect(isCarouselInteractive(3, 3)).toBe(false);
      expect(isCarouselInteractive(2, 3)).toBe(false);
      expect(isCarouselInteractive(1, 1)).toBe(false);
    });

    it('returns true when there are more items than visible cards', () => {
      expect(isCarouselInteractive(6, 3)).toBe(true);
      expect(isCarouselInteractive(4, 2)).toBe(true);
      expect(isCarouselInteractive(2, 1)).toBe(true);
    });
  });
});
