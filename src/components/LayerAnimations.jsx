import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { animationManager } from '../utils/advancedAnimations';

const LayerAnimations = ({ 
  slideElement, 
  slideIndex,
  slideData,
  isActive = false,
  onAnimationComplete 
}) => {
  const animationTimeoutRef = useRef(null);

  // Execute animations when slide becomes active
  useEffect(() => {
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (!isActive || !slideElement) return;

    const executeAnimations = () => {
      // Find elements
      const title = slideElement.querySelector('.title');
      const subtitle = slideElement.querySelector('.subtitle');
      const cta = slideElement.querySelector('.cta');

      // Clear any existing animations
      animationManager.clearAnimations(title);
      animationManager.clearAnimations(subtitle);
      animationManager.clearAnimations(cta);

      // Get animation configurations from slide data
      const animations = slideData?.animations || {};
      
      // Default animation settings
      const defaultTitleAnim = animations.title || { preset: 'slideUp', delay: 0.3, duration: 0.8 };
      const defaultSubtitleAnim = animations.subtitle || { preset: 'slideUp', delay: 0.5, duration: 0.8 };
      const defaultCtaAnim = animations.cta || { preset: 'zoomIn', delay: 0.7, duration: 0.8 };

      // Execute animations with the advanced system
      if (title) {
        animationManager.executePreset(defaultTitleAnim.preset, title, {
          delay: defaultTitleAnim.delay,
          duration: defaultTitleAnim.duration,
          easing: defaultTitleAnim.easing
        });
      }
      
      if (subtitle) {
        animationManager.executePreset(defaultSubtitleAnim.preset, subtitle, {
          delay: defaultSubtitleAnim.delay,
          duration: defaultSubtitleAnim.duration,
          easing: defaultSubtitleAnim.easing
        });
      }
      
      if (cta) {
        animationManager.executePreset(defaultCtaAnim.preset, cta, {
          delay: defaultCtaAnim.delay,
          duration: defaultCtaAnim.duration,
          easing: defaultCtaAnim.easing
        });
      }

      // Call completion callback after longest animation
      const maxDelay = Math.max(
        defaultTitleAnim.delay + defaultTitleAnim.duration,
        defaultSubtitleAnim.delay + defaultSubtitleAnim.duration,
        defaultCtaAnim.delay + defaultCtaAnim.duration
      );
      
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, (maxDelay * 1000) + 100);
      }
    };

    // Small delay to ensure slide transition is complete
    animationTimeoutRef.current = setTimeout(executeAnimations, 100);
    
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, [isActive, slideElement, slideIndex, slideData]);

  return null;
};

export default LayerAnimations;
