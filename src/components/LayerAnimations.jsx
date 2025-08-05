import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LayerAnimations = ({ 
  slideElement, 
  slideIndex,
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

      // Set initial state (hidden)
      if (title) gsap.set(title, { opacity: 0, y: 30 });
      if (subtitle) gsap.set(subtitle, { opacity: 0, y: 30 });
      if (cta) gsap.set(cta, { opacity: 0, y: 30 });

      // Create timeline
      const tl = gsap.timeline({
        onComplete: () => {
          if (onAnimationComplete) onAnimationComplete();
        }
      });

      // Animate elements with stagger
      if (title) {
        tl.to(title, { 
          opacity: 1, 
          y: 0, 
          duration: 0.6,
          ease: "power2.out"
        }, 0.3);
      }
      
      if (subtitle) {
        tl.to(subtitle, { 
          opacity: 1, 
          y: 0, 
          duration: 0.6,
          ease: "power2.out"
        }, 0.5);
      }
      
      if (cta) {
        tl.to(cta, { 
          opacity: 1, 
          y: 0, 
          duration: 0.6,
          ease: "power2.out"
        }, 0.7);
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
  }, [isActive, slideElement, slideIndex]);

  return null;
};

export default LayerAnimations;
