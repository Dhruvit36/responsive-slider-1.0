import { gsap } from 'gsap';

// Animation presets
export const animationPresets = {
  slideIn: {
    in: { x: 100, opacity: 0 },
    out: { x: 0, opacity: 1 },
    duration: 0.8,
    ease: "power2.out"
  },
  slideInLeft: {
    in: { x: -100, opacity: 0 },
    out: { x: 0, opacity: 1 },
    duration: 0.8,
    ease: "power2.out"
  },
  fadeIn: {
    in: { opacity: 0 },
    out: { opacity: 1 },
    duration: 0.8,
    ease: "power2.out"
  },
  slideUp: {
    in: { y: 50, opacity: 0 },
    out: { y: 0, opacity: 1 },
    duration: 0.8,
    ease: "power2.out"
  },
  slideDown: {
    in: { y: -50, opacity: 0 },
    out: { y: 0, opacity: 1 },
    duration: 0.8,
    ease: "power2.out"
  },
  scaleIn: {
    in: { scale: 0.8, opacity: 0 },
    out: { scale: 1, opacity: 1 },
    duration: 0.8,
    ease: "power2.out"
  },
  rotateIn: {
    in: { rotation: -10, opacity: 0 },
    out: { rotation: 0, opacity: 1 },
    duration: 0.8,
    ease: "power2.out"
  },
  bounceIn: {
    in: { scale: 0.3, opacity: 0 },
    out: { scale: 1, opacity: 1 },
    duration: 0.8,
    ease: "back.out(1.7)"
  },
  flipIn: {
    in: { rotationY: 90, opacity: 0 },
    out: { rotationY: 0, opacity: 1 },
    duration: 0.8,
    ease: "power2.out"
  }
};

// Animation manager class
export class AnimationManager {
  constructor() {
    this.timelines = new Set();
  }

  executePreset(element, preset, config = {}) {
    if (!element || !animationPresets[preset]) return;

    const animation = animationPresets[preset];
    const duration = config.duration || animation.duration;
    const ease = config.easing || animation.ease;

    // Set initial state
    gsap.set(element, animation.in);

    // Animate to final state
    const tl = gsap.to(element, {
      ...animation.out,
      duration,
      ease,
      delay: config.delay || 0
    });

    this.timelines.add(tl);
    return tl;
  }

  createTimeline(config = {}) {
    const tl = gsap.timeline(config);
    this.timelines.add(tl);
    return tl;
  }

  killAll() {
    this.timelines.forEach(tl => tl.kill());
    this.timelines.clear();
  }
}

// Global animation manager instance
export const globalAnimationManager = new AnimationManager();

// Utility functions
export const animationUtils = {
  staggerElements: (elements, preset, stagger = 0.1) => {
    elements.forEach((element, index) => {
      setTimeout(() => {
        globalAnimationManager.executePreset(element, preset, {
          delay: index * stagger
        });
      }, 0);
    });
  }
};
