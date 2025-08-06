import { useEffect, useRef } from 'react';
import { animationManager } from '../utils/advancedAnimations';

const MultiLayerAnimations = ({ 
  slideElement, 
  slideIndex,
  slideData,
  layers = [],
  layerElements,
  isActive = false,
  onAnimationComplete 
}) => {
  const animationTimeoutRef = useRef(null);

  // Execute multi-layer animations when slide becomes active
  useEffect(() => {
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (!isActive || !slideElement) return;

    const executeAnimations = () => {
      // Traditional slide content (title, subtitle, cta)
      const title = slideElement.querySelector('.title');
      const subtitle = slideElement.querySelector('.subtitle');
      const cta = slideElement.querySelector('.cta');

      // Clear existing animations
      if (title) animationManager.clearAnimations(title);
      if (subtitle) animationManager.clearAnimations(subtitle);
      if (cta) animationManager.clearAnimations(cta);

      // Clear layer animations
      if (layerElements) {
        layerElements.forEach((element) => {
          animationManager.clearAnimations(element);
        });
      }

      // Get animation configurations
      const animations = slideData?.animations || {};

      // Traditional content animations
      const defaultTitleAnim = animations.title || { preset: 'slideUp', delay: 0.3, duration: 0.8 };
      const defaultSubtitleAnim = animations.subtitle || { preset: 'slideUp', delay: 0.5, duration: 0.8 };
      const defaultCtaAnim = animations.cta || { preset: 'zoomIn', delay: 0.7, duration: 0.8 };

      let maxAnimationTime = 0;

      // Execute traditional animations
      if (title) {
        animationManager.executePreset(defaultTitleAnim.preset, title, {
          delay: defaultTitleAnim.delay,
          duration: defaultTitleAnim.duration,
          easing: defaultTitleAnim.easing
        });
        maxAnimationTime = Math.max(maxAnimationTime, defaultTitleAnim.delay + defaultTitleAnim.duration);
      }
      
      if (subtitle) {
        animationManager.executePreset(defaultSubtitleAnim.preset, subtitle, {
          delay: defaultSubtitleAnim.delay,
          duration: defaultSubtitleAnim.duration,
          easing: defaultSubtitleAnim.easing
        });
        maxAnimationTime = Math.max(maxAnimationTime, defaultSubtitleAnim.delay + defaultSubtitleAnim.duration);
      }
      
      if (cta) {
        animationManager.executePreset(defaultCtaAnim.preset, cta, {
          delay: defaultCtaAnim.delay,
          duration: defaultCtaAnim.duration,
          easing: defaultCtaAnim.easing
        });
        maxAnimationTime = Math.max(maxAnimationTime, defaultCtaAnim.delay + defaultCtaAnim.duration);
      }

      // Execute layer animations
      if (layerElements && layers.length > 0) {
        layers.forEach((layer, index) => {
          const layerElement = layerElements.get(index);
          
          if (!layerElement || !layer.animation) return;

          const anim = layer.animation;
          animationManager.executePreset(anim.preset, layerElement, {
            delay: anim.delay || 0,
            duration: anim.duration || 0.8,
            easing: anim.easing || 'power2.out'
          });

          maxAnimationTime = Math.max(maxAnimationTime, (anim.delay || 0) + (anim.duration || 0.8));
        });
      }

      // Notify when all animations are complete
      if (onAnimationComplete) {
        setTimeout(() => {
          onAnimationComplete();
        }, maxAnimationTime * 1000);
      }
    };

    // Small delay to ensure DOM is ready
    animationTimeoutRef.current = setTimeout(executeAnimations, 100);

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isActive, slideElement, slideData, layers, layerElements, onAnimationComplete]);

  return null; // This component doesn't render anything
};

export default MultiLayerAnimations;
