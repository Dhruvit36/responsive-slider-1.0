import { useRef, useEffect } from 'react';

const ContentLayer = ({ 
  layer, 
  layerIndex,
  slideIndex,
  onElementReady
}) => {
  const layerRef = useRef(null);

  // Notify parent when layer element is ready
  useEffect(() => {
    if (layerRef.current && onElementReady) {
      onElementReady(layerRef.current, layerIndex);
    }
  }, []); // Empty dependency array to run only once

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
      'bottom-right': 'absolute bottom-0 right-0'
    };

    return positions[position] || positions['center'];
  };

  // Render different layer types
  const renderLayerContent = () => {
    switch (layer.type) {
      case 'text':
        return (
          <div className="text-layer">
            {layer.content && (
              <div className="layer-content">
                {layer.content}
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="image-layer">
            <img 
              src={layer.src} 
              alt={layer.alt || 'Layer image'}
              className="max-w-full h-auto"
              style={layer.imageStyles}
            />
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
      className={`content-layer ${getPositionClasses()}`}
      style={{
        zIndex: layer.zIndex || layerIndex + 10,
        opacity: 0, // Start hidden for animations
        ...layer.style
      }}
      data-layer-type={layer.type}
      data-layer-index={layerIndex}
    >
      {renderLayerContent()}
    </div>
  );
};

export default ContentLayer;
