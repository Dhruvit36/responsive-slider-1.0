import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for enhanced touch and swipe gestures
 * @param {Object} options - Configuration options
 * @param {HTMLElement} options.element - Element to attach touch events to
 * @param {Function} options.onSwipeLeft - Function to call on left swipe
 * @param {Function} options.onSwipeRight - Function to call on right swipe
 * @param {Function} options.onTouchStart - Function to call on touch start
 * @param {Function} options.onTouchEnd - Function to call on touch end
 * @param {boolean} options.enabled - Whether touch gestures are enabled
 * @param {Object} options.sensitivity - Touch sensitivity settings
 */
export const useTouchGestures = ({
  element,
  onSwipeLeft,
  onSwipeRight,
  onTouchStart,
  onTouchEnd,
  enabled = true,
  sensitivity = {
    minDistance: 50,    // Minimum swipe distance
    maxTime: 300,       // Maximum swipe time (ms)
    threshold: 30       // Minimum velocity threshold
  }
}) => {
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);
  const [touchDirection, setTouchDirection] = useState(null);
  const [touchProgress, setTouchProgress] = useState(0);

  // Handle touch start
  const handleTouchStart = useCallback((event) => {
    if (!enabled) return;

    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    setIsTouch(true);
    setTouchDirection(null);
    setTouchProgress(0);

    if (onTouchStart) {
      onTouchStart(event);
    }
  }, [enabled, onTouchStart]);

  // Handle touch move
  const handleTouchMove = useCallback((event) => {
    if (!enabled || !touchStartRef.current) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Only handle horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault(); // Prevent vertical scrolling when swiping horizontally
      
      const direction = deltaX > 0 ? 'right' : 'left';
      const progress = Math.min(Math.abs(deltaX) / sensitivity.minDistance, 1);
      
      setTouchDirection(direction);
      setTouchProgress(progress);
    }
  }, [enabled, sensitivity.minDistance]);

  // Handle touch end
  const handleTouchEnd = useCallback((event) => {
    if (!enabled || !touchStartRef.current) return;

    const touch = event.changedTouches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    const deltaTime = touchEndRef.current.time - touchStartRef.current.time;
    
    const distance = Math.abs(deltaX);
    const velocity = distance / deltaTime;

    // Check if it's a valid swipe (horizontal, minimum distance, within time limit, sufficient velocity)
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const isValidDistance = distance >= sensitivity.minDistance;
    const isValidTime = deltaTime <= sensitivity.maxTime;
    const isValidVelocity = velocity >= sensitivity.threshold / 1000; // Convert to px/ms

    if (isHorizontalSwipe && isValidDistance && isValidTime && isValidVelocity) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight(event);
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft(event);
      }
    }

    // Reset state
    setIsTouch(false);
    setTouchDirection(null);
    setTouchProgress(0);
    touchStartRef.current = null;
    touchEndRef.current = null;

    if (onTouchEnd) {
      onTouchEnd(event);
    }
  }, [enabled, sensitivity, onSwipeLeft, onSwipeRight, onTouchEnd]);

  // Attach event listeners
  useEffect(() => {
    if (!enabled || !element) return;

    const touchOptions = { passive: false }; // Allow preventDefault

    element.addEventListener('touchstart', handleTouchStart, touchOptions);
    element.addEventListener('touchmove', handleTouchMove, touchOptions);
    element.addEventListener('touchend', handleTouchEnd, touchOptions);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [element, enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isTouch,
    touchDirection,
    touchProgress,
    gestureState: {
      isActive: isTouch,
      direction: touchDirection,
      progress: touchProgress
    }
  };
};

export default useTouchGestures;
