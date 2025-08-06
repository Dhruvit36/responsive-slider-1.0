import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sliderPersistence, createDebouncedSave } from '../persistence';

describe('sliderPersistence', () => {
  let store;

  beforeEach(() => {
    store = {};
    global.localStorage = {
      getItem: vi.fn(key => store[key] || null),
      setItem: vi.fn((key, value) => { store[key] = value; }),
      removeItem: vi.fn(key => { delete store[key]; })
    };
    vi.spyOn(Date, 'now').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('saves and loads state', () => {
    sliderPersistence.saveState({ currentSlide: 2, settings: { foo: 'bar' } });
    const result = sliderPersistence.loadState();
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(result).toEqual({ currentSlide: 2, settings: { foo: 'bar' } });
  });

  it('expires state after 24h', () => {
    sliderPersistence.saveState({ currentSlide: 1, settings: {} });
    vi.spyOn(Date, 'now').mockReturnValue(25 * 60 * 60 * 1000);
    const result = sliderPersistence.loadState();
    expect(result).toBeNull();
  });

  it('clears state', () => {
    sliderPersistence.saveState({ currentSlide: 1, settings: {} });
    sliderPersistence.clearState();
    expect(localStorage.removeItem).toHaveBeenCalled();
  });

  it('detects availability', () => {
    expect(sliderPersistence.isAvailable()).toBe(true);
  });
});

describe('createDebouncedSave', () => {
  it('debounces calls', () => {
    vi.useFakeTimers();
    const saveFn = vi.fn();
    const debounced = createDebouncedSave(saveFn, 1000);
    debounced({ a: 1 });
    debounced({ a: 2 });
    vi.advanceTimersByTime(1000);
    expect(saveFn).toHaveBeenCalledTimes(1);
    expect(saveFn).toHaveBeenCalledWith({ a: 2 });
    vi.useRealTimers();
  });
});
