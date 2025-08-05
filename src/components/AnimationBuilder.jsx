import { useState, useEffect } from 'react';
import { animationManager, ANIMATION_PRESETS } from '../utils/advancedAnimations';

const AnimationBuilder = ({ 
  isOpen, 
  onClose, 
  slideData,
  onSave 
}) => {
  const [selectedElement, setSelectedElement] = useState('title');
  const [currentAnimations, setCurrentAnimations] = useState({
    title: { preset: 'slideUp', delay: 0.3, duration: 0.8, easing: 'power2.out' },
    subtitle: { preset: 'slideUp', delay: 0.5, duration: 0.8, easing: 'power2.out' },
    cta: { preset: 'zoomIn', delay: 0.7, duration: 0.8, easing: 'power2.out' }
  });

  // Initialize with slide data
  useEffect(() => {
    if (slideData?.animations) {
      setCurrentAnimations(prev => ({
        ...prev,
        ...slideData.animations
      }));
    }
  }, [slideData]);

  const handlePresetChange = (preset) => {
    setCurrentAnimations(prev => ({
      ...prev,
      [selectedElement]: {
        ...prev[selectedElement],
        preset
      }
    }));
  };

  const handlePropertyChange = (property, value) => {
    setCurrentAnimations(prev => ({
      ...prev,
      [selectedElement]: {
        ...prev[selectedElement],
        [property]: value
      }
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(currentAnimations);
    }
    onClose();
  };

  const availablePresets = Object.keys(ANIMATION_PRESETS);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Animation Builder</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Element Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Element:</label>
          <div className="flex gap-2">
            {['title', 'subtitle', 'cta'].map((element) => (
              <button
                key={element}
                onClick={() => setSelectedElement(element)}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  selectedElement === element 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {element.charAt(0).toUpperCase() + element.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Animation Settings */}
        <div className="space-y-6">
          {/* Preset Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Animation Preset:</label>
            <select
              value={currentAnimations[selectedElement]?.preset || 'slideUp'}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              {availablePresets.map((preset) => (
                <option key={preset} value={preset} className="text-gray-900 bg-white">
                  {ANIMATION_PRESETS[preset].name}
                </option>
              ))}
            </select>
          </div>

          {/* Delay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delay: <span className="font-bold text-blue-600">{currentAnimations[selectedElement]?.delay || 0}s</span>
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={currentAnimations[selectedElement]?.delay || 0}
              onChange={(e) => handlePropertyChange('delay', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0s</span>
              <span>2s</span>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration: <span className="font-bold text-blue-600">{currentAnimations[selectedElement]?.duration || 0.8}s</span>
            </label>
            <input
              type="range"
              min="0.2"
              max="2"
              step="0.1"
              value={currentAnimations[selectedElement]?.duration || 0.8}
              onChange={(e) => handlePropertyChange('duration', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.2s</span>
              <span>2s</span>
            </div>
          </div>

          {/* Easing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Easing:</label>
            <select
              value={currentAnimations[selectedElement]?.easing || 'power2.out'}
              onChange={(e) => handlePropertyChange('easing', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              <option value="power2.out" className="text-gray-900 bg-white">Power2 Out</option>
              <option value="power2.in" className="text-gray-900 bg-white">Power2 In</option>
              <option value="back.out(1.7)" className="text-gray-900 bg-white">Back Out</option>
              <option value="elastic.out" className="text-gray-900 bg-white">Elastic Out</option>
              <option value="bounce.out" className="text-gray-900 bg-white">Bounce Out</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Save Animations
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimationBuilder;