import { useCallback, useState, useEffect } from 'react';
import { useSliderContext } from '../context/SliderContext';

const NavigationControls = ({ 
  swiperRef,
  position = 'bottom-center',
  showArrows = true,
  showPagination = true,
  showPlayPause = true,
  autoHide = true,
  hideDelay = 3000,
  customStyle = {},
  theme = 'glass', // glass, solid, minimal, custom
  size = 'medium', // small, medium, large
  animationStyle = 'fade' // fade, slide, scale, bounce
}) => {
  const { 
    slides, 
    currentSlide, 
    settings, 
    updateSettings 
  } = useSliderContext();

  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);

  // Auto-hide functionality
  useEffect(() => {
    if (!autoHide) {
      setIsVisible(true);
      return;
    }

    const resetHideTimer = () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
      
      setIsVisible(true);
      
      if (!isHovered && !isActive) {
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, hideDelay);
        setHideTimeout(timer);
      }
    };

    resetHideTimer();

    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [autoHide, hideDelay, isHovered, isActive]);

  // Handle mouse activity for auto-hide
  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleInteraction = () => {
    setIsActive(true);
    setIsVisible(true);
    
    // Reset active state after brief moment
    setTimeout(() => {
      setIsActive(false);
    }, 1000);
  };

  // Navigation handlers
  const goToPrevSlide = useCallback(() => {
    if (swiperRef?.current?.swiper) {
      swiperRef.current.swiper.slidePrev();
      handleInteraction();
    }
  }, [swiperRef]);

  const goToNextSlide = useCallback(() => {
    if (swiperRef?.current?.swiper) {
      swiperRef.current.swiper.slideNext();
      handleInteraction();
    }
  }, [swiperRef]);

  const goToSlide = useCallback((index) => {
    if (swiperRef?.current?.swiper) {
      swiperRef.current.swiper.slideTo(index);
      handleInteraction();
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
    
    handleInteraction();
  }, [settings.autoplay, updateSettings, swiperRef]);

  // Get theme-based button styles
  const getThemeStyles = () => {
    const sizeClasses = {
      small: 'p-2 w-8 h-8',
      medium: 'p-3 w-12 h-12',
      large: 'p-4 w-16 h-16'
    };

    const themes = {
      glass: {
        button: `${sizeClasses[size]} bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white border-opacity-20 hover:scale-110 active:scale-95`,
        pagination: 'bg-white bg-opacity-40 hover:bg-opacity-60',
        paginationActive: 'bg-white scale-125'
      },
      solid: {
        button: `${sizeClasses[size]} bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95`,
        pagination: 'bg-gray-400 hover:bg-gray-300',
        paginationActive: 'bg-gray-800 scale-125'
      },
      minimal: {
        button: `${sizeClasses[size]} bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full transition-all duration-300 border-2 border-white border-opacity-50 hover:border-opacity-100 hover:scale-110 active:scale-95`,
        pagination: 'bg-transparent border-2 border-white border-opacity-50 hover:border-opacity-100',
        paginationActive: 'bg-white border-white scale-125'
      },
      custom: {
        button: `${sizeClasses[size]} transition-all duration-300 hover:scale-110 active:scale-95`,
        pagination: 'transition-all duration-300',
        paginationActive: 'scale-125'
      }
    };

    return themes[theme] || themes.glass;
  };

  // Get animation classes
  const getAnimationClasses = () => {
    const animations = {
      fade: isVisible ? 'opacity-100' : 'opacity-0',
      slide: isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      scale: isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
      bounce: isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
    };

    return `transition-all duration-500 ease-out ${animations[animationStyle] || animations.fade}`;
  };

  // Position classes
  const getPositionClasses = () => {
    const baseClasses = `absolute z-40 flex items-center gap-4 pointer-events-auto ${getAnimationClasses()}`;
    
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
        return `${baseClasses} left-6 top-1/2 transform -translate-y-1/2 flex-col gap-6`;
      case 'center-right':
        return `${baseClasses} right-6 top-1/2 transform -translate-y-1/2 flex-col gap-6`;
      case 'floating':
        return `${baseClasses} bottom-8 right-8 flex-col gap-3 bg-black bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm`;
      default:
        return `${baseClasses} bottom-6 left-1/2 transform -translate-x-1/2`;
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div 
      className={getPositionClasses()} 
      style={customStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Arrow Navigation */}
      {showArrows && (
        <>
          <button
            onClick={goToPrevSlide}
            className={themeStyles.button}
            aria-label="Previous slide"
          >
            <svg 
              width={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              height={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          
          <button
            onClick={goToNextSlide}
            className={themeStyles.button}
            aria-label="Next slide"
          >
            <svg 
              width={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              height={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {showPagination && slides && slides.length > 1 && (
        <div className={`flex gap-2 ${position.includes('center-') ? 'flex-col' : ''}`}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                size === 'small' ? 'w-2 h-2' : size === 'large' ? 'w-4 h-4' : 'w-3 h-3'
              } ${
                index === currentSlide
                  ? themeStyles.paginationActive
                  : themeStyles.pagination
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
          className={themeStyles.button}
          aria-label={settings.autoplay.enabled ? 'Pause autoplay' : 'Start autoplay'}
        >
          {settings.autoplay.enabled ? (
            <svg 
              width={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              height={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg 
              width={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              height={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <polygon points="5,3 19,12 5,21"></polygon>
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default NavigationControls;
