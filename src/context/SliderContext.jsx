import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import sliderPersistence, { createDebouncedSave } from '../utils/persistence';

// Create context
const SliderContext = createContext();

// Provider component
export const SliderProvider = ({ children }) => {
  const persistedState = useMemo(() => sliderPersistence.loadState(), []);

  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(persistedState?.currentSlide || 0);
  const [isLoading, setIsLoading] = useState(true);
  const [eventListeners, setEventListeners] = useState(new Map());
  const defaultSettings = {
    autoplay: {
      enabled: true,
      delay: 5000
    },
    navigation: {
      enabled: true,
      arrows: true,
      pagination: true
    },
    loop: true,
    speed: 600,
    spaceBetween: 0,
    slidesPerView: 1
  };
  const [settings, setSettings] = useState({
    ...defaultSettings,
    ...(persistedState?.settings || {}),
    autoplay: {
      ...defaultSettings.autoplay,
      ...(persistedState?.settings?.autoplay || {})
    },
    navigation: {
      ...defaultSettings.navigation,
      ...(persistedState?.settings?.navigation || {})
    }
  });

  const debouncedSave = useMemo(
    () => createDebouncedSave(sliderPersistence.saveState),
    []
  );

  useEffect(() => {
    debouncedSave({ currentSlide, settings });
  }, [currentSlide, settings, debouncedSave]);

  // Load slides from JSON
  useEffect(() => {
    const loadSlides = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/slides.json');
        const data = await response.json();
        
        // Update settings with hierarchy: default -> global -> breakpoint-specific
        if (data.settings || data.autoplay) {
          const newSettings = {
            ...settings,
            ...data.settings,
            autoplay: {
              ...settings.autoplay,
              ...(data.autoplay || data.settings?.autoplay)
            }
          };

          // Apply breakpoint-specific settings if applicable
          if (data.breakpoints) {
            const screenWidth = window.innerWidth;
            
            for (const [breakpointName, breakpoint] of Object.entries(data.breakpoints)) {
              if (screenWidth <= breakpoint.maxWidth) {
                Object.assign(newSettings, {
                  ...newSettings,
                  ...breakpoint.settings,
                  autoplay: {
                    ...newSettings.autoplay,
                    ...breakpoint.settings?.autoplay
                  }
                });
                break; // Use first matching breakpoint
              }
            }
          }
          
          setSettings(newSettings);
        }
        
        setSlides(data.slides || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading slides:', error);
        setIsLoading(false);
      }
    };

    loadSlides();

    // Listen for window resize to handle responsive breakpoints
    const handleResize = () => {
      // Debounce resize events
      const timeoutId = setTimeout(() => {
        loadSlides(); // Reload with new breakpoint settings
      }, 250);
      
      return () => clearTimeout(timeoutId);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update settings function - memoized to prevent re-renders
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  // Update individual slide
  const updateSlide = useCallback((slideIndex, updatedSlide) => {
    setSlides(prev => {
      const newSlides = [...prev];
      if (slideIndex >= 0 && slideIndex < newSlides.length) {
        newSlides[slideIndex] = updatedSlide;
      }
      return newSlides;
    });
  }, []);

  // Event system functions
  const addEventListener = useCallback((event, callback) => {
    setEventListeners(prev => {
      const newListeners = new Map(prev);
      if (!newListeners.has(event)) {
        newListeners.set(event, new Set());
      }
      newListeners.get(event).add(callback);
      return newListeners;
    });

    // Return cleanup function
    return () => {
      setEventListeners(prev => {
        const newListeners = new Map(prev);
        if (newListeners.has(event)) {
          newListeners.get(event).delete(callback);
          if (newListeners.get(event).size === 0) {
            newListeners.delete(event);
          }
        }
        return newListeners;
      });
    };
  }, []);

  const removeEventListener = useCallback((event, callback) => {
    setEventListeners(prev => {
      const newListeners = new Map(prev);
      if (newListeners.has(event)) {
        newListeners.get(event).delete(callback);
        if (newListeners.get(event).size === 0) {
          newListeners.delete(event);
        }
      }
      return newListeners;
    });
  }, []);

  const dispatchEvent = useCallback((event, data = {}) => {
    if (eventListeners.has(event)) {
      eventListeners.get(event).forEach(callback => {
        try {
          callback({ type: event, ...data });
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }, [eventListeners]);

  // Enhanced slide change with events
  const setCurrentSlideWithEvents = useCallback((newIndex) => {
    const prevIndex = currentSlide;
    
    // Dispatch before change event
    dispatchEvent('beforeSlideChange', {
      from: prevIndex,
      to: newIndex,
      slide: slides[newIndex]
    });

    setCurrentSlide(newIndex);

    // Dispatch after change event (in next tick)
    setTimeout(() => {
      dispatchEvent('slideChange', {
        from: prevIndex,
        to: newIndex,
        slide: slides[newIndex]
      });
    }, 0);
  }, [currentSlide, slides, dispatchEvent]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    slides,
    currentSlide,
    isLoading,
    settings,
    setCurrentSlide: setCurrentSlideWithEvents,
    updateSettings,
    updateSlide,
    setSlides,
    setIsLoading,
    // Event system
    addEventListener,
    removeEventListener,
    dispatchEvent
  }), [slides, currentSlide, isLoading, settings, updateSettings, updateSlide, setCurrentSlideWithEvents, addEventListener, removeEventListener, dispatchEvent]);

  return (
    <SliderContext.Provider value={value}>
      {children}
    </SliderContext.Provider>
  );
};

// Custom hook to use the slider context
export const useSliderContext = () => {
  const context = useContext(SliderContext);
  if (!context) {
    throw new Error('useSliderContext must be used within a SliderProvider');
  }
  return context;
};
