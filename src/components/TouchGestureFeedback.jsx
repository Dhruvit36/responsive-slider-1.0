import React from 'react';

/**
 * Visual feedback component for touch and swipe gestures
 * Shows swipe direction indicators and progress
 */
const TouchGestureFeedback = ({ 
  isActive, 
  direction, 
  progress = 0,
  position = 'center'
}) => {
  if (!isActive) return null;

  const isLeft = direction === 'left';
  const isRight = direction === 'right';

  // Calculate opacity based on progress (0 to 1)
  const opacity = Math.min(progress * 2, 1); // Fade in faster
  const scale = 0.8 + (progress * 0.2); // Scale from 0.8 to 1.0

  // Position classes
  const positionClasses = {
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    left: 'top-1/2 left-8 transform -translate-y-1/2',
    right: 'top-1/2 right-8 transform -translate-y-1/2'
  };

  return (
    <div className={`
      fixed z-40 pointer-events-none transition-all duration-100 ease-out
      ${positionClasses[position]}
    `}>
      <div 
        className="flex items-center justify-center w-16 h-16 bg-black bg-opacity-60 rounded-full backdrop-blur-sm border border-white border-opacity-20"
        style={{ 
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {/* Left Swipe Indicator */}
        {isLeft && (
          <div className="flex items-center text-white">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="animate-pulse"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
        )}

        {/* Right Swipe Indicator */}
        {isRight && (
          <div className="flex items-center text-white">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="animate-pulse"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {progress > 0.3 && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="text-white text-xs font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
            {isLeft ? 'Next Slide' : 'Previous Slide'}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Touch drag indicator showing swipe progress
 */
export const TouchDragIndicator = ({ 
  isActive, 
  direction, 
  progress = 0,
  position = 'bottom'
}) => {
  if (!isActive || progress < 0.1) return null;

  const isLeft = direction === 'left';
  const width = Math.min(progress * 100, 100);

  // Position classes
  const positionClasses = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0'
  };

  return (
    <div className={`
      absolute ${positionClasses[position]} z-30 pointer-events-none
      flex items-center justify-center h-1
    `}>
      <div className="w-full h-full bg-white bg-opacity-20 backdrop-blur-sm">
        <div 
          className={`
            h-full transition-all duration-100 ease-out
            ${isLeft ? 'bg-blue-400' : 'bg-green-400'}
          `}
          style={{ 
            width: `${width}%`,
            transformOrigin: isLeft ? 'left' : 'right'
          }}
        />
      </div>
    </div>
  );
};

/**
 * Hook to manage touch gesture feedback
 */
export const useTouchGestureFeedback = () => {
  return {
    FeedbackComponent: TouchGestureFeedback,
    DragIndicator: TouchDragIndicator
  };
};

export default TouchGestureFeedback;
