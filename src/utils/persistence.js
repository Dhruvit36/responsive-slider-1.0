// Slider state persistence utilities

const STORAGE_KEY = 'slider-state';

export const sliderPersistence = {
  // Save slider state to localStorage
  saveState: (state) => {
    try {
      const stateToSave = {
        currentSlide: state.currentSlide,
        settings: state.settings,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save slider state:', error);
    }
  },

  // Load slider state from localStorage
  loadState: () => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (!savedState) return null;

      const parsed = JSON.parse(savedState);
      
      // Check if state is not too old (24 hours)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - parsed.timestamp > maxAge) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return {
        currentSlide: parsed.currentSlide || 0,
        settings: parsed.settings || {}
      };
    } catch (error) {
      console.warn('Failed to load slider state:', error);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  // Clear saved state
  clearState: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear slider state:', error);
    }
  },

  // Check if state persistence is available
  isAvailable: () => {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
};

// Debounce utility for frequent saves
export const createDebouncedSave = (saveFunction, delay = 500) => {
  let timeoutId;
  
  return (state) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      saveFunction(state);
    }, delay);
  };
};

export default sliderPersistence;
