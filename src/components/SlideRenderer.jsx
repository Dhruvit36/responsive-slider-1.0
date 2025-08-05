import { useRef, useEffect, useState } from 'react';
import LayerAnimations from './LayerAnimations';

const SlideRenderer = ({ 
  slide, 
  index, 
  isActive = false,
  onSlideReady,
  onAnimationComplete 
}) => {
  const slideRef = useRef(null);
  const [hasNotifiedReady, setHasNotifiedReady] = useState(false);

  // Notify parent when slide is ready (only once)
  useEffect(() => {
    if (slideRef.current && onSlideReady && !hasNotifiedReady) {
      onSlideReady(slideRef.current, index);
      setHasNotifiedReady(true);
    }
  }, [onSlideReady, index, hasNotifiedReady]);

  return (
    <div 
      ref={slideRef}
      className="relative w-full h-full bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url(${slide.image})`,
        backgroundColor: '#1a1a1a' 
      }}
    >
      {/* Default overlay for better text visibility */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: slide.overlay?.gradient || 'rgba(0,0,0,0.4)' 
        }}
      />
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
        <div className="max-w-4xl">
          {slide.title && (
            <h1 className="title text-4xl md:text-6xl font-bold mb-4">
              {slide.title}
            </h1>
          )}
          {slide.subtitle && (
            <p className="subtitle text-xl md:text-2xl mb-8">
              {slide.subtitle}
            </p>
          )}
          {slide.buttonText && (
            <button className="cta bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
              {slide.buttonText}
            </button>
          )}
        </div>
      </div>

      {/* Layer Animations */}
      <LayerAnimations
        key={`${index}-${isActive ? 'active' : 'inactive'}`}
        slideElement={slideRef.current}
        slideIndex={index}
        isActive={isActive}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
};

export default SlideRenderer;
