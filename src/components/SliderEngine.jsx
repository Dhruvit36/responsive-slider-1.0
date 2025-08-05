import { useRef, useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useSliderContext } from '../context/SliderContext';
import SlideRenderer from './SlideRenderer';
import NavigationControls from './NavigationControls';
import SliderSettings from './SliderSettings';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

const SliderEngine = ({ 
  className = "",
  height = "100vh",
  showSettingsButton = true,
  showCustomNavigation = true,
  navigationPosition = "bottom-center"
}) => {
  const swiperRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [slideElements, setSlideElements] = useState({});
  
  const { 
    slides, 
    currentSlide, 
    isLoading, 
    settings, 
    setCurrentSlide,
    updateSettings
  } = useSliderContext();

  // Handle slide change
  const handleSlideChange = useCallback((swiper) => {
    const newIndex = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;
    setCurrentSlide(newIndex);
  }, [setCurrentSlide]);

  // Handle slide ready (store slide elements for animations)
  const handleSlideReady = useCallback((slideElement, index) => {
    setSlideElements(prev => ({
      ...prev,
      [index]: slideElement
    }));
  }, []);

  // Handle animation complete
  const handleAnimationComplete = useCallback(() => {
    // Animation completed - could add callback here if needed
  }, []);

  // Update swiper when settings change
  useEffect(() => {
    if (!swiperRef.current?.swiper) return;

    const swiper = swiperRef.current.swiper;
    
    // Update autoplay
    if (settings.autoplay.enabled) {
      swiper.autoplay.start();
      swiper.params.autoplay.delay = settings.autoplay.delay;
    } else {
      swiper.autoplay.stop();
    }

    // Update other settings
    swiper.params.speed = settings.speed;
    swiper.params.loop = settings.loop;
    swiper.update();
  }, [settings]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl text-white">Loading slides...</p>
        </div>
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="text-xl text-white">No slides available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        
        // Basic settings
        loop={settings.loop}
        speed={settings.speed}
        spaceBetween={settings.spaceBetween}
        slidesPerView={settings.slidesPerView}
        
        // Autoplay
        autoplay={settings.autoplay.enabled ? {
          delay: settings.autoplay.delay,
          disableOnInteraction: false,
        } : false}
        
        // Navigation - disable default Swiper navigation when using custom
        navigation={!showCustomNavigation && settings.navigation.enabled && settings.navigation.arrows}
        pagination={!showCustomNavigation && settings.navigation.enabled && settings.navigation.pagination ? {
          clickable: true,
        } : false}
        
        // Events
        onSlideChange={handleSlideChange}
        
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <SlideRenderer
              slide={slide}
              index={index}
              isActive={index === currentSlide}
              onSlideReady={handleSlideReady}
              onAnimationComplete={handleAnimationComplete}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Controls */}
      {showCustomNavigation && settings.navigation.enabled && (
        <NavigationControls
          swiperRef={swiperRef}
          position={navigationPosition}
          showArrows={settings.navigation.arrows}
          showPagination={settings.navigation.pagination}
          showPlayPause={true}
        />
      )}
      
      {/* Settings Button */}
      {showSettingsButton && (
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-4 right-4 z-50 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all backdrop-blur-sm border border-white border-opacity-20"
          aria-label="Open slider settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="m12 1 1.665 5.815L21 12l-7.335 5.185L12 23l-1.665-5.815L3 12l7.335-5.185L12 1z"></path>
          </svg>
        </button>
      )}

      {/* Settings Panel */}
      <SliderSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        position="right"
      />
    </div>
  );
};

export default SliderEngine;
