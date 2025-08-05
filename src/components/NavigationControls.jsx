import { useCallback } from 'react';
import { useSliderContext } from '../context/SliderContext';

const NavigationControls = ({ 
  swiperRef,
  position = 'bottom-center',
  showArrows = true,
  showPagination = true,
  showPlayPause = true,
  customStyle = {}
}) => {
  const { 
    slides, 
    currentSlide, 
    settings, 
    updateSettings 
  } = useSliderContext();

  // Navigation handlers
  const goToPrevSlide = useCallback(() => {
    if (swiperRef?.current?.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  }, [swiperRef]);

  const goToNextSlide = useCallback(() => {
    if (swiperRef?.current?.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  }, [swiperRef]);

  const goToSlide = useCallback((index) => {
    if (swiperRef?.current?.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  }, [swiperRef]);

  const toggleAutoplay = useCallback(() => {
    const newAutoplayState = !settings.autoplay.enabled;
    updateSettings({
      autoplay: {
        ...settings.autoplay,
        enabled: newAutoplayState
      }
    });

    if (swiperRef?.current?.swiper) {
      if (newAutoplayState) {
        swiperRef.current.swiper.autoplay.start();
      } else {
        swiperRef.current.swiper.autoplay.stop();
      }
    }
  }, [settings.autoplay, updateSettings, swiperRef]);

  // Position classes
  const getPositionClasses = () => {
    const baseClasses = 'absolute z-40 flex items-center gap-4';
    
    switch (position) {
      case 'bottom-center':
        return `${baseClasses} bottom-6 left-1/2 transform -translate-x-1/2`;
      case 'bottom-left':
        return `${baseClasses} bottom-6 left-6`;
      case 'bottom-right':
        return `${baseClasses} bottom-6 right-6`;
      case 'top-center':
        return `${baseClasses} top-6 left-1/2 transform -translate-x-1/2`;
      case 'top-left':
        return `${baseClasses} top-6 left-6`;
      case 'top-right':
        return `${baseClasses} top-6 right-6`;
      case 'center-left':
        return `${baseClasses} left-6 top-1/2 transform -translate-y-1/2 flex-col`;
      case 'center-right':
        return `${baseClasses} right-6 top-1/2 transform -translate-y-1/2 flex-col`;
      default:
        return `${baseClasses} bottom-6 left-1/2 transform -translate-x-1/2`;
    }
  };

  return (
    <div className={getPositionClasses()} style={customStyle}>
      {/* Arrow Navigation */}
      {showArrows && (
        <>
          <button
            onClick={goToPrevSlide}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white border-opacity-20"
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          
          <button
            onClick={goToNextSlide}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white border-opacity-20"
            aria-label="Next slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {showPagination && slides && slides.length > 1 && (
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white bg-opacity-40 hover:bg-opacity-60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Play/Pause Button */}
      {showPlayPause && (
        <button
          onClick={toggleAutoplay}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white border-opacity-20"
          aria-label={settings.autoplay.enabled ? 'Pause autoplay' : 'Start autoplay'}
        >
          {settings.autoplay.enabled ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5,3 19,12 5,21"></polygon>
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default NavigationControls;
