import { useState, useEffect } from 'react';
import { useSliderContext } from '../context/SliderContext';
import AnimationPresetDemo from './AnimationPresetDemo';

const SliderSettings = ({ 
  isOpen = false, 
  onClose,
  position = 'right'
}) => {
  const { settings, updateSettings } = useSliderContext();
  const [localSettings, setLocalSettings] = useState(settings);
  const [showAnimationDemo, setShowAnimationDemo] = useState(false);

  // Sync local settings with context when it changes
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Apply settings
  const handleApplySettings = () => {
    updateSettings(localSettings);
    if (onClose) onClose();
  };

  // Reset to defaults
  const handleResetSettings = () => {
    const defaultSettings = {
      autoplay: {
        enabled: true,
        delay: 5000
      },
      navigation: {
        enabled: true,
        arrows: true,
        pagination: true
      },
      touch: {
        minDistance: 50,
        maxTime: 300,
        threshold: 30
      },
      loop: true,
      speed: 600,
      spaceBetween: 0,
      slidesPerView: 1
    };
    setLocalSettings(defaultSettings);
  };

  // Update local setting
  const updateLocalSetting = (path, value) => {
    setLocalSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  if (!isOpen) return null;

  const panelClasses = `fixed top-0 ${position === 'right' ? 'right-0' : 'left-0'} h-full w-80 bg-gray-900 bg-opacity-95 backdrop-blur-lg text-white z-50 transform transition-transform duration-300 overflow-y-auto`;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      <div className={panelClasses}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Slider Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Autoplay</h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={localSettings.autoplay?.enabled}
                  onChange={(e) => updateLocalSetting('autoplay.enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span>Enable Autoplay</span>
              </label>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Delay (ms): {localSettings.autoplay?.delay}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={localSettings.autoplay?.delay || 5000}
                  onChange={(e) => updateLocalSetting('autoplay.delay', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Navigation</h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={localSettings.navigation?.enabled}
                  onChange={(e) => updateLocalSetting('navigation.enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span>Enable Navigation</span>
              </label>

              <label className="flex items-center space-x-3 ml-6">
                <input
                  type="checkbox"
                  checked={localSettings.navigation?.arrows}
                  onChange={(e) => updateLocalSetting('navigation.arrows', e.target.checked)}
                  disabled={!localSettings.navigation?.enabled}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 disabled:opacity-50"
                />
                <span>Show Arrows</span>
              </label>

              <label className="flex items-center space-x-3 ml-6">
                <input
                  type="checkbox"
                  checked={localSettings.navigation?.pagination}
                  onChange={(e) => updateLocalSetting('navigation.pagination', e.target.checked)}
                  disabled={!localSettings.navigation?.enabled}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 disabled:opacity-50"
                />
                <span>Show Pagination</span>
              </label>
            </div>
          </div>

          {/* Touch Gestures Section */}
          <div className="mb-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Touch & Gestures</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Swipe Distance (px)</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="10"
                  value={localSettings.touch?.minDistance || 50}
                  onChange={(e) => updateLocalSetting('touch.minDistance', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Sensitive (20px)</span>
                  <span>{localSettings.touch?.minDistance || 50}px</span>
                  <span>Less Sensitive (100px)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Swipe Speed (ms)</label>
                <input
                  type="range"
                  min="200"
                  max="500"
                  step="50"
                  value={localSettings.touch?.maxTime || 300}
                  onChange={(e) => updateLocalSetting('touch.maxTime', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Fast (200ms)</span>
                  <span>{localSettings.touch?.maxTime || 300}ms</span>
                  <span>Slow (500ms)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Touch Sensitivity</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={localSettings.touch?.threshold || 30}
                  onChange={(e) => updateLocalSetting('touch.threshold', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>High (10)</span>
                  <span>{localSettings.touch?.threshold || 30}</span>
                  <span>Low (50)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Animation Demo Section */}
          <div className="mb-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Animation Presets</h3>
            <button
              onClick={() => setShowAnimationDemo(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-all duration-200"
            >
              🎭 View Animation Demo
            </button>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              onClick={handleResetSettings}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApplySettings}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
      
      {/* Animation Demo Modal */}
      <AnimationPresetDemo 
        isVisible={showAnimationDemo}
        onClose={() => setShowAnimationDemo(false)}
      />
    </>
  );
};

export default SliderSettings;
