import { gsap } from 'gsap';

// Basic animation presets for Phase 2
export const ANIMATION_PRESETS = {
  // Entrance animations
  fadeIn: {
    name: 'Fade In',
    category: 'entrance',
    animation: (element, options = {}) => {
      return gsap.fromTo(element, 
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: options.duration || 0.8,
          delay: options.delay || 0,
          ease: options.easing || 'power2.out'
        }
      );
    }
  },
  
  slideUp: {
    name: 'Slide Up',
    category: 'entrance',
    animation: (element, options = {}) => {
      return gsap.fromTo(element,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: options.duration || 0.8,
          delay: options.delay || 0,
          ease: options.easing || 'power2.out'
        }
      );
    }
  },

  slideDown: {
    name: 'Slide Down',
    category: 'entrance', 
    animation: (element, options = {}) => {
      return gsap.fromTo(element,
        { y: -50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: options.duration || 0.8,
          delay: options.delay || 0,
          ease: options.easing || 'power2.out'
        }
      );
    }
  },

  slideLeft: {
    name: 'Slide Left',
    category: 'entrance',
    animation: (element, options = {}) => {
      return gsap.fromTo(element,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: options.duration || 0.8,
          delay: options.delay || 0,
          ease: options.easing || 'power2.out'
        }
      );
    }
  },

  slideRight: {
    name: 'Slide Right',
    category: 'entrance',
    animation: (element, options = {}) => {
      return gsap.fromTo(element,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: options.duration || 0.8,
          delay: options.delay || 0,
          ease: options.easing || 'power2.out'
        }
      );
    }
  },

  slideIn: {
    name: 'Slide In',
    category: 'entrance',
    animation: (element, options = {}) => {
      return gsap.fromTo(element,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: options.duration || 0.8,
          delay: options.delay || 0,
          ease: options.easing || 'power2.out'
        }
      );
    }
  },

  slideInRight: {
    name: 'Slide In Right',
    category: 'entrance',
    animation: (element, options = {}) => {
      return gsap.fromTo(element,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: options.duration || 0.8,
          delay: options.delay || 0,
          ease: options.easing || 'power2.out'
        }
      );
    }
  },

  slideInLeft: {
    name: 'Slide In Left',
    category: 'entrance',
    animation: (element, options = {}) => {
      return gsap.fromTo(element,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: options.duration || 0.8,
          delay: options.delay || 0,
          ease: options.easing || 'power2.out'
        }
      );
    }
  },

  zoomIn: {
    name: 'Zoom In',
    category: 'entrance',
    animation: (element, options = {}) => {
      return gsap.fromTo(element,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: options.duration || 0.8,
          delay: options.delay || 0,
          ease: options.easing || 'back.out(1.7)'
        }
      );
    }
  },

  scaleIn: {
    name: 'Scale In',
    category: 'entrance',
    animation: (element, options = {}) => {
      return gsap.fromTo(element,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: options.duration || 0.6,
          delay: options.delay || 0,
          ease: options.easing || 'back.out(1.7)'
        }
      );
    }
  },

  bounceIn: {
    name: 'Bounce In',
    category: 'entrance',
    animation: (element, options = {}) => {
      return gsap.fromTo(element,
        { scale: 0.3, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: options.duration || 0.8,
          delay: options.delay || 0,
          ease: options.easing || 'bounce.out'
        }
      );
    }
  },

  rotateIn: {
    name: 'Rotate In',
    category: 'entrance',
    animation: (element, options = {}) => {
      return gsap.fromTo(element,
        { rotation: -180, scale: 0.8, opacity: 0 },
        {
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: options.duration || 0.8,
          delay: options.delay || 0,
          ease: options.easing || 'power2.out'
        }
      );
    }
  },

  flipIn: {
    name: 'Flip In',
    category: 'entrance',
    animation: (element, options = {}) => {
      return gsap.fromTo(element,
        { rotationY: -90, opacity: 0 },
        {
          rotationY: 0,
          opacity: 1,
          duration: options.duration || 0.8,
          delay: options.delay || 0,
          ease: options.easing || 'power2.out'
        }
      );
    }
  }
};

// Simple animation manager
export class AdvancedAnimationManager {
  constructor() {
    this.activeAnimations = new Map();
  }

  // Execute animation preset
  executePreset(presetName, element, options = {}) {
    if (!element || !ANIMATION_PRESETS[presetName]) {
      console.warn(`Animation preset "${presetName}" not found or element is null`);
      return null;
    }

    const preset = ANIMATION_PRESETS[presetName];
    return preset.animation(element, options);
  }

  // Get available presets
  getPresets() {
    return Object.keys(ANIMATION_PRESETS).map(key => ({
      key,
      ...ANIMATION_PRESETS[key]
    }));
  }

  // Clear all animations on element
  clearAnimations(element) {
    if (element) {
      gsap.killTweensOf(element);
    }
  }
}

// Export singleton instance
export const animationManager = new AdvancedAnimationManager();