import { useRef, useEffect, useState } from 'react';

const ContentLayer = ({ 
  layer, 
  layerIndex,
  slideIndex,
  onElementReady,
  onLayerInteraction
}) => {
  const layerRef = useRef(null);
  const [layerState, setLayerState] = useState('idle'); // idle, hover, active, disabled

  // Check if layer is interactive
  const isInteractive = layer.interactive === true || (
    layer.onClick || 
    layer.onHover || 
    layer.interactions ||
    layer.type === 'button'
  );

  // Notify parent when layer element is ready
  useEffect(() => {
    if (layerRef.current && onElementReady) {
      onElementReady(layerRef.current, layerIndex);
    }
  }, []); // Empty dependency array to run only once

  // Handle layer interactions
  const handleLayerClick = (event) => {
    if (!isInteractive) return;
    
    event.stopPropagation(); // Prevent slide navigation
    setLayerState('active');
    
    if (layer.onClick) {
      layer.onClick(layerIndex, layer, event);
    }
    
    if (onLayerInteraction) {
      onLayerInteraction('click', layerIndex, layer, event);
    }
    
    // Reset state after animation
    setTimeout(() => setLayerState('idle'), 200);
  };

  const handleLayerHover = (isEntering) => {
    if (!isInteractive) return;
    
    setLayerState(isEntering ? 'hover' : 'idle');
    
    if (layer.onHover && isEntering) {
      layer.onHover(layerIndex, layer);
    }
    
    if (onLayerInteraction) {
      onLayerInteraction(isEntering ? 'hover' : 'unhover', layerIndex, layer);
    }
  };

  // Get position classes based on layer positioning
  const getPositionClasses = () => {
    const { position } = layer;
    if (!position) return 'absolute inset-0 flex items-center justify-center';

    const positions = {
      'top-left': 'absolute top-0 left-0',
      'top-center': 'absolute top-0 left-1/2 transform -translate-x-1/2',
      'top-right': 'absolute top-0 right-0',
      'center-left': 'absolute top-1/2 left-0 transform -translate-y-1/2',
      'middle-left': 'absolute top-1/2 left-0 transform -translate-y-1/2',
      'center': 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
      'center-right': 'absolute top-1/2 right-0 transform -translate-y-1/2',
      'middle-right': 'absolute top-1/2 right-0 transform -translate-y-1/2',
      'bottom-left': 'absolute bottom-0 left-0',
      'bottom-center': 'absolute bottom-0 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'absolute bottom-0 right-0',
      'custom': 'absolute' // For custom x,y positioning
    };

    return positions[position] || positions['center'];
  };

  // Get custom positioning styles
  const getCustomStyles = () => {
    const { position, x, y, width, height } = layer;
    const baseStyles = position === 'custom' ? {
      left: x !== undefined ? `${x}px` : undefined,
      top: y !== undefined ? `${y}px` : undefined,
      width: width ? `${width}px` : undefined,
      height: height ? `${height}px` : undefined,
    } : {};

    // Merge layer styles with positioning styles
    return {
      ...baseStyles,
      ...layer.style
    };
  };

  // Render different layer types
  const renderLayerContent = () => {
    switch (layer.type) {
      case 'text':
        return (
          <div className="text-layer">
            {layer.title && (
              <h1 className="layer-title text-4xl font-bold mb-4">
                {layer.title}
              </h1>
            )}
            {layer.subtitle && (
              <h2 className="layer-subtitle text-xl mb-6">
                {layer.subtitle}
              </h2>
            )}
            {layer.content && (
              <div className="layer-content">
                {layer.content}
              </div>
            )}
            {layer.buttonText && (
              <button className="layer-button bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                {layer.buttonText}
              </button>
            )}
          </div>
        );

      case 'button':
        return (
          <div className="button-layer">
            <button 
              className={`interactive-button px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                layerState === 'hover' ? 'transform scale-105' : ''
              } ${
                layerState === 'active' ? 'transform scale-95' : ''
              }`}
              style={{
                backgroundColor: layer.buttonColor || '#3B82F6',
                color: layer.textColor || 'white',
                ...layer.buttonStyle
              }}
            >
              {layer.content || layer.buttonText || 'Click Me'}
            </button>
          </div>
        );

      case 'image':
        return (
          <div className="image-layer">
            <img 
              src={layer.src} 
              alt={layer.alt || 'Layer image'}
              className={`max-w-full h-auto transition-transform duration-200 ${
                layerState === 'hover' ? 'transform scale-105' : ''
              }`}
              style={layer.imageStyles}
            />
            {layer.caption && (
              <p className="image-caption text-sm mt-2">
                {layer.caption}
              </p>
            )}
          </div>
        );

      case 'custom':
        return (
          <div 
            className="custom-layer"
            dangerouslySetInnerHTML={{ __html: layer.html }}
          />
        );

      default:
        return (
          <div className="default-layer">
            {layer.content || 'Unknown layer type'}
          </div>
        );
    }
  };

  return (
    <div 
      ref={layerRef}
      className={`content-layer ${getPositionClasses()} ${
        isInteractive ? 'interactive cursor-pointer' : ''
      } ${layerState}`}
      style={{
        zIndex: layer.zIndex || layerIndex + 10,
        opacity: 0, // Start hidden for animations
        ...getCustomStyles()
      }}
      data-layer-type={layer.type}
      data-layer-index={layerIndex}
      data-layer-position={layer.position}
      data-interactive={isInteractive}
      onClick={handleLayerClick}
      onMouseEnter={() => handleLayerHover(true)}
      onMouseLeave={() => handleLayerHover(false)}
    >
      {renderLayerContent()}
    </div>
  );
};

export default ContentLayer;
