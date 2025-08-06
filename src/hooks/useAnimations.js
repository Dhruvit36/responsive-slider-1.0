import { useCallback, useEffect, useRef } from 'react';
import { animationManager } from '../utils/advancedAnimations';

/**
 * Hook for managing animations in slides
 * Provides easy access to animation presets and cleanup
 */
export const useAnimations = () => {
  const animationRefs = useRef(new Set());

  // Execute an animation preset on an element
  const executeAnimation = useCallback((presetName, element, options = {}) => {
    if (!element) return null;

    const animation = animationManager.executePreset(presetName, element, options);
    if (animation) {
      animationRefs.current.add(animation);
      
      // Clean up the animation reference when it completes
      animation.then?.(() => {
        animationRefs.current.delete(animation);
      });
    }
    
    return animation;
  }, []);

  // Get all available animation presets
  const getAvailablePresets = useCallback(() => {
    return animationManager.getPresets();
  }, []);

  // Clear all active animations
  const clearAllAnimations = useCallback(() => {
    animationRefs.current.forEach(animation => {
      if (animation?.kill) {
        animation.kill();
      }
    });
    animationRefs.current.clear();
  }, []);

  // Clear animations on unmount
  useEffect(() => {
    return () => {
      clearAllAnimations();
    };
  }, [clearAllAnimations]);

  return {
    executeAnimation,
    getAvailablePresets,
    clearAllAnimations
  };
};

// Export preset categories for easier filtering
export const ANIMATION_CATEGORIES = {
  ENTRANCE: 'entrance',
  TEXT: 'text',
  EXIT: 'exit'
};
