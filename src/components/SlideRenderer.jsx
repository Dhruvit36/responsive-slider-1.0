import { useRef, useEffect, useState } from 'react';
import LayerAnimations from './LayerAnimations';
import VideoBackground from './VideoBackground';
import ContentLayer from './ContentLayer';
import MultiLayerAnimations from './MultiLayerAnimations';

const SlideRenderer = ({ 
  slide, 
  index, 
  isActive = false,
  onSlideReady,
  onAnimationComplete 
}) => {
  const slideRef = useRef(null);
  const [hasNotifiedReady, setHasNotifiedReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [layerElements, setLayerElements] = useState(new Map());

  // Check if this is a video slide
  const isVideoSlide = slide.video || slide.videoSrc;
  const shouldWaitForVideo = isVideoSlide && !videoReady;

  // Check if this is a multi-layer slide
  const isMultiLayerSlide = Array.isArray(slide.layers) && slide.layers.length > 0;

  // Handle layer element registration
  const handleLayerElementReady = (element, layerIndex) => {
    setLayerElements(prev => {
      const newMap = new Map(prev);
      newMap.set(layerIndex, element);
      return newMap;
    });
  };

  // Handle layer interactions
  const handleLayerInteraction = (interactionType, layerIndex, layer, event) => {
    // Basic interaction feedback - we'll expand this in later steps
    switch (interactionType) {
      case 'click':
        // Could trigger other layer animations, slide navigation, etc.
        break;
      case 'hover':
        break;
      case 'unhover':
        break;
    }
  };

  // Notify parent when slide is ready (only once)
  useEffect(() => {
    if (slideRef.current && onSlideReady && !hasNotifiedReady && !shouldWaitForVideo) {
      onSlideReady(slideRef.current, index);
      setHasNotifiedReady(true);
    }
  }, [onSlideReady, index, hasNotifiedReady, shouldWaitForVideo]);

  // Handle video ready callback
  const handleVideoReady = () => {
    setVideoReady(true);
  };

  return (
    <div 
      ref={slideRef}
      className="relative w-full h-full"
      style={{ 
        backgroundColor: '#1a1a1a' 
      }}
    >
      {/* Background - Video or Image */}
      {isVideoSlide ? (
        <VideoBackground
          videoSrc={slide.video || slide.videoSrc}
          posterImage={slide.poster || slide.image}
          autoplay={slide.videoSettings?.autoplay !== false}
          muted={slide.videoSettings?.muted !== false}
          loop={slide.videoSettings?.loop !== false}
          controls={slide.videoSettings?.controls === true}
          showCustomControls={slide.videoSettings?.showCustomControls === true}
          playbackRate={slide.videoSettings?.playbackRate || 1}
          isActive={isActive}
          onVideoReady={handleVideoReady}
        />
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: slide.image ? `url(${slide.image})` : 'none'
          }}
        />
      )}

      {/* Overlay for better text visibility */}
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

      {/* Multi-Layer Content */}
      {isMultiLayerSlide && slide.layers.map((layer, layerIndex) => (
        <ContentLayer
          key={`layer-${layerIndex}`}
          layer={layer}
          layerIndex={layerIndex}
          slideIndex={index}
          onElementReady={handleLayerElementReady}
          onLayerInteraction={handleLayerInteraction}
        />
      ))}

      {/* Animations - Choose system based on slide type */}
      {isMultiLayerSlide ? (
        <MultiLayerAnimations
          key={`${index}-${isActive ? 'active' : 'inactive'}`}
          slideElement={slideRef.current}
          slideIndex={index}
          slideData={slide}
          layers={slide.layers}
          layerElements={layerElements}
          isActive={isActive}
          onAnimationComplete={onAnimationComplete}
        />
      ) : (
        <LayerAnimations
          key={`${index}-${isActive ? 'active' : 'inactive'}`}
          slideElement={slideRef.current}
          slideIndex={index}
          slideData={slide}
          isActive={isActive}
          onAnimationComplete={onAnimationComplete}
        />
      )}
    </div>
  );
};

export default SlideRenderer;
