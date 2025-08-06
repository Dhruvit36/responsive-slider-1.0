import React, { useState, useEffect } from 'react';

const KeyboardShortcuts = ({ shortcuts, isVisible, onDismiss }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black bg-opacity-90 text-white p-4 rounded-lg border border-gray-600 max-w-sm">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">⌨️ Keyboard Shortcuts</h3>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-white ml-2"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-300">Next slide:</span>
          <span className="bg-gray-700 px-2 py-1 rounded text-xs">→</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Previous slide:</span>
          <span className="bg-gray-700 px-2 py-1 rounded text-xs">←</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Pause/Resume:</span>
          <span className="bg-gray-700 px-2 py-1 rounded text-xs">Space</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Touch swipe:</span>
          <span className="bg-gray-700 px-2 py-1 rounded text-xs">👈 👉</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Close menus:</span>
          <span className="bg-gray-700 px-2 py-1 rounded text-xs">Esc</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-600">
        This help will auto-hide in a few seconds
      </div>
    </div>
  );
};

/**
 * Hook to manage keyboard shortcuts visibility
 * Shows shortcuts for a few seconds on initial load
 */
export const useKeyboardHelp = ({ autoHideDelay = 5000 } = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShownInitialHelp, setHasShownInitialHelp] = useState(false);

  // Show help on initial load
  useEffect(() => {
    if (!hasShownInitialHelp) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasShownInitialHelp(true);
      }, 1000); // Show after 1 second

      return () => clearTimeout(timer);
    }
  }, [hasShownInitialHelp]);

  // Auto-hide after delay
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDelay]);

  const showHelp = () => setIsVisible(true);
  const hideHelp = () => setIsVisible(false);

  return {
    isVisible,
    showHelp,
    hideHelp
  };
};

export default KeyboardShortcuts;
