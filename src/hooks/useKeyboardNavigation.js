import { useHotkeys } from 'react-hotkeys-hook';
import { useCallback } from 'react';

/**
 * Custom hook for handling keyboard navigation in the slider
 * @param {Object} options - Configuration options
 * @param {Function} options.onNext - Function to call when navigating to next slide
 * @param {Function} options.onPrev - Function to call when navigating to previous slide
 * @param {Function} options.onToggleAutoplay - Function to toggle autoplay
 * @param {Function} options.onEscape - Function to call on escape key
 * @param {boolean} options.enabled - Whether keyboard navigation is enabled
 */
export const useKeyboardNavigation = ({
  onNext,
  onPrev,
  onToggleAutoplay,
  onEscape,
  enabled = true
}) => {
  
  // Navigate to next slide
  const handleNext = useCallback(() => {
    if (enabled && onNext) {
      onNext();
    }
  }, [enabled, onNext]);

  // Navigate to previous slide
  const handlePrev = useCallback(() => {
    if (enabled && onPrev) {
      onPrev();
    }
  }, [enabled, onPrev]);

  // Toggle autoplay
  const handleToggleAutoplay = useCallback(() => {
    if (enabled && onToggleAutoplay) {
      onToggleAutoplay();
    }
  }, [enabled, onToggleAutoplay]);

  // Handle escape
  const handleEscape = useCallback(() => {
    if (enabled && onEscape) {
      onEscape();
    }
  }, [enabled, onEscape]);

  // Register keyboard shortcuts
  useHotkeys('ArrowRight', handleNext, { enabled });
  useHotkeys('ArrowLeft', handlePrev, { enabled });
  useHotkeys('space', handleToggleAutoplay, { 
    enabled,
    preventDefault: true, // Prevent page scroll
    keydown: true // Trigger on keydown instead of keyup
  });
  useHotkeys('escape', handleEscape, { enabled });

  // Return keyboard status and helper functions
  return {
    isEnabled: enabled,
    shortcuts: {
      next: 'Arrow Right (→)',
      prev: 'Arrow Left (←)', 
      toggleAutoplay: 'Space Bar',
      escape: 'Escape'
    }
  };
};

export default useKeyboardNavigation;
