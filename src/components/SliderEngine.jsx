import { useRef, useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useSliderContext } from '../context/SliderContext';
import useKeyboardNavigation from '../hooks/useKeyboardNavigation';
import SlideRenderer from './SlideRenderer';
import NavigationControls from './NavigationControls';
import SliderSettings from './SliderSettings';
import AnimationBuilder from './AnimationBuilder';
import KeyboardShortcuts, { useKeyboardHelp } from './KeyboardShortcuts';

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
  const [showAnimationBuilder, setShowAnimationBuilder] = useState(false);
  const [slideElements, setSlideElements] = useState({});
  
  const { 
    slides, 
    currentSlide, 
    isLoading, 
    settings, 
    setCurrentSlide,
    updateSettings,
    updateSlide
  } = useSliderContext();

  // Handle animation save
  const handleAnimationSave = useCallback((animations) => {
    if (slides[currentSlide]) {
      const updatedSlide = {
        ...slides[currentSlide],
        animations
      };
      updateSlide(currentSlide, updatedSlide);
    }
  }, [slides, currentSlide, updateSlide]);

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

  // Keyboard navigation handlers
  const handleNext = useCallback(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  }, []);

  const handlePrev = useCallback(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  }, []);

  const handleToggleAutoplay = useCallback(() => {
    if (swiperRef.current?.swiper) {
      const swiper = swiperRef.current.swiper;
      const isCurrentlyRunning = swiper.autoplay && swiper.autoplay.running;
      
      if (isCurrentlyRunning) {
        swiper.autoplay.stop();
        updateSettings({
          ...settings,
          autoplay: {
            ...settings.autoplay,
            enabled: false
          }
        });
      } else if (swiper.autoplay) {
        swiper.autoplay.start();
        updateSettings({
          ...settings,
          autoplay: {
            ...settings.autoplay,
            enabled: true
          }
        });
      }
    }
  }, [settings, updateSettings]);

  const handleEscape = useCallback(() => {
    // Close any open modals/settings
    if (showSettings) {
      setShowSettings(false);
    } else if (showAnimationBuilder) {
      setShowAnimationBuilder(false);
    }
  }, [showSettings, showAnimationBuilder]);

  // Enable keyboard navigation
  const keyboardNavigation = useKeyboardNavigation({
    onNext: handleNext,
    onPrev: handlePrev,
    onToggleAutoplay: handleToggleAutoplay,
    onEscape: handleEscape,
    enabled: !showSettings && !showAnimationBuilder // Disable when modals are open
  });

  // Keyboard help visibility
  const keyboardHelp = useKeyboardHelp({ autoHideDelay: 4000 });

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
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <button
            onClick={keyboardHelp.showHelp}
            className="bg-blue-600 bg-opacity-90 text-white p-3 rounded-full hover:bg-blue-700 transition-all backdrop-blur-sm border border-white border-opacity-20"
            aria-label="Show keyboard shortcuts"
            title="Keyboard Shortcuts (⌨️)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M6 10h.01M10 10h4M6 14h.01M14 14h.01M18 14h.01" />
            </svg>
          </button>
          <button
            onClick={() => setShowAnimationBuilder(!showAnimationBuilder)}
            className="bg-purple-600 bg-opacity-90 text-white p-3 rounded-full hover:bg-purple-700 transition-all backdrop-blur-sm border border-white border-opacity-20"
            aria-label="Open animation builder"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all backdrop-blur-sm border border-white border-opacity-20"
            aria-label="Open slider settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="m12 1 1.665 5.815L21 12l-7.335 5.185L12 23l-1.665-5.815L3 12l7.335-5.185L12 1z"></path>
            </svg>
          </button>
        </div>
      )}

      {/* Settings Panel */}
      <SliderSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        position="right"
      />

      {/* Animation Builder */}
      <AnimationBuilder
        isOpen={showAnimationBuilder}
        onClose={() => setShowAnimationBuilder(false)}
        slideData={slides[currentSlide]}
        onSave={handleAnimationSave}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcuts
        shortcuts={keyboardNavigation.shortcuts}
        isVisible={keyboardHelp.isVisible}
        onDismiss={keyboardHelp.hideHelp}
      />
    </div>
  );
};

export default SliderEngine;
