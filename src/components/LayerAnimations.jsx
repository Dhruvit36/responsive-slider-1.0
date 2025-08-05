import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { animationPresets } from '../utils/animations';

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
      gsap.killTweensOf([title, subtitle, cta]);

      // Get animation configurations from slide data
      const animations = slideData?.animations || {};
      
      // Default animation settings
      const defaultAnimation = {
        preset: 'slideUp',
        delay: 0.3,
        duration: 0.6,
        easing: 'power2.out'
      };

      // Apply animations based on slide configuration or defaults
      const elements = [
        { element: title, config: animations.title || { ...defaultAnimation, delay: 0.3 } },
        { element: subtitle, config: animations.subtitle || { ...defaultAnimation, delay: 0.5 } },
        { element: cta, config: animations.cta || { ...defaultAnimation, delay: 0.7, preset: 'scaleIn' } }
      ];

      // Create timeline
      const tl = gsap.timeline({
        onComplete: () => {
          if (onAnimationComplete) onAnimationComplete();
        }
      });

      elements.forEach(({ element, config }) => {
        if (!element) return;

        const preset = animationPresets[config.preset] || animationPresets.slideUp;
        
        // Set initial state
        gsap.set(element, preset.in);

        // Add animation to timeline
        tl.to(element, {
          ...preset.out,
          duration: config.duration || preset.duration,
          ease: config.easing || preset.ease,
        }, config.delay || 0);
      });
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
