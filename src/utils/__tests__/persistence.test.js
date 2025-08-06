import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { sliderPersistence, createDebouncedSave } from '../persistence.js';

let store;

beforeEach(() => {
  store = {};
  global.localStorage = {
    getItem: vi.fn((key) => (key in store ? store[key] : null)),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    })
  };
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('sliderPersistence.saveState', () => {
  it('stores state with a timestamp', () => {
    const state = { currentSlide: 2, settings: { theme: 'dark' } };
    sliderPersistence.saveState(state);
    const saved = JSON.parse(localStorage.getItem('slider-state'));
    expect(saved.currentSlide).toBe(2);
    expect(saved.settings).toEqual({ theme: 'dark' });
    expect(typeof saved.timestamp).toBe('number');
  });

  it('does not throw on storage failure', () => {
    localStorage.setItem.mockImplementation(() => {
      throw new Error('fail');
    });
    expect(() => sliderPersistence.saveState({})).not.toThrow();
  });
});

describe('sliderPersistence.loadState', () => {
  it('loads stored state', () => {
    const data = {
      currentSlide: 1,
      settings: { loop: true },
      timestamp: Date.now()
    };
    localStorage.setItem('slider-state', JSON.stringify(data));
    const result = sliderPersistence.loadState();
    expect(result).toEqual({ currentSlide: 1, settings: { loop: true } });
  });

  it('purges stale state', () => {
    const stale = {
      currentSlide: 0,
      settings: {},
      timestamp: Date.now() - (24 * 60 * 60 * 1000 + 1)
    };
    localStorage.setItem('slider-state', JSON.stringify(stale));
    const result = sliderPersistence.loadState();
    expect(result).toBeNull();
    expect(localStorage.getItem('slider-state')).toBeNull();
  });

  it('does not throw on load failure', () => {
    localStorage.getItem.mockImplementation(() => 'invalid json');
    const result = sliderPersistence.loadState();
    expect(result).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('slider-state');
  });
});

describe('sliderPersistence.clearState', () => {
  it('removes stored state', () => {
    sliderPersistence.clearState();
    expect(localStorage.removeItem).toHaveBeenCalledWith('slider-state');
  });

  it('does not throw on failure', () => {
    localStorage.removeItem.mockImplementation(() => {
      throw new Error('fail');
    });
    expect(() => sliderPersistence.clearState()).not.toThrow();
  });
});

describe('sliderPersistence.isAvailable', () => {
  it('returns true when localStorage works', () => {
    expect(sliderPersistence.isAvailable()).toBe(true);
  });

  it('returns false when localStorage fails', () => {
    localStorage.setItem.mockImplementation(() => {
      throw new Error('fail');
    });
    expect(sliderPersistence.isAvailable()).toBe(false);
  });
});

describe('createDebouncedSave', () => {
  it('debounces save calls', () => {
    vi.useFakeTimers();
    const save = vi.fn();
    const debounced = createDebouncedSave(save, 100);

    debounced({ currentSlide: 1 });
    debounced({ currentSlide: 2 });
    expect(save).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith({ currentSlide: 2 });
    vi.useRealTimers();
  });
});
