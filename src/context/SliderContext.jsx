import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// Create context
const SliderContext = createContext();

// Provider component
export const SliderProvider = ({ children }) => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
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
  });

  // Load slides from JSON
  useEffect(() => {
    const loadSlides = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/slides.json');
        const data = await response.json();
        
        // Update settings if provided in JSON
        if (data.autoplay || data.settings) {
          setSettings(prev => ({
            ...prev,
            autoplay: data.autoplay || prev.autoplay,
            ...data.settings
          }));
        }
        
        setSlides(data.slides || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading slides:', error);
        setIsLoading(false);
      }
    };

    loadSlides();
  }, []);

  // Update settings function - memoized to prevent re-renders
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    slides,
    currentSlide,
    isLoading,
    settings,
    setCurrentSlide,
    updateSettings,
    setSlides,
    setIsLoading
  }), [slides, currentSlide, isLoading, settings, updateSettings]);

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
