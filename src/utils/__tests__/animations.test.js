import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('gsap', () => ({
  gsap: {
    set: vi.fn(),
    to: vi.fn(() => ({ kill: vi.fn() })),
    timeline: vi.fn(() => ({ kill: vi.fn() })),
    killTweensOf: vi.fn()
  }
}));
import { AnimationManager, globalAnimationManager, animationUtils } from '../animations.js';

const gsap = (await import('gsap')).gsap;

describe('AnimationManager', () => {
  let manager;
  beforeEach(() => {
    manager = new AnimationManager();
  });

  it('executes preset and tracks timeline', () => {
    const el = {};
    manager.executePreset(el, 'fadeIn');
    expect(gsap.set).toHaveBeenCalled();
    expect(gsap.to).toHaveBeenCalled();
    expect(manager.timelines.size).toBe(1);
  });

  it('creates timeline and kills all', () => {
    const tl = manager.createTimeline();
    expect(gsap.timeline).toHaveBeenCalled();
    expect(manager.timelines.has(tl)).toBe(true);
    manager.killAll();
    expect(manager.timelines.size).toBe(0);
  });
});

describe('animationUtils', () => {
  it('staggerElements calls executePreset with delays', () => {
    const spy = vi.spyOn(globalAnimationManager, 'executePreset');
    animationUtils.staggerElements(['a', 'b', 'c'], 'fadeIn', 0.2);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls[1][1]).toBe('fadeIn');
    spy.mockRestore();
  });
});
