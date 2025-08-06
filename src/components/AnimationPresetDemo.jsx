import React, { useState } from 'react';
import { useAnimations, ANIMATION_CATEGORIES } from '../hooks/useAnimations';

const AnimationPresetDemo = ({ isVisible = false, onClose }) => {
  const { getAvailablePresets, executeAnimation } = useAnimations();
  const [selectedCategory, setSelectedCategory] = useState('entrance');
  
  if (!isVisible) return null;

  const presets = getAvailablePresets();
  const filteredPresets = presets.filter(preset => 
    preset.category === selectedCategory
  );

  const handlePresetTest = (presetName) => {
    const demoElement = document.getElementById('animation-demo-element');
    if (demoElement) {
      // Reset element state
      demoElement.style.transform = '';
      demoElement.style.opacity = '';
      demoElement.style.filter = '';
      
      // Execute animation
      executeAnimation(presetName, demoElement, {
        duration: 1.0,
        delay: 0.1
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Animation Presets Demo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* Category Filter */}
        <div className="mb-4">
          <div className="flex space-x-2">
            {Object.values(ANIMATION_CATEGORIES).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Area */}
        <div className="mb-6 p-8 bg-gray-100 rounded-lg text-center">
          <div
            id="animation-demo-element"
            className="text-4xl font-bold text-blue-600 inline-block"
          >
            Demo Text
          </div>
        </div>

        {/* Animation Presets Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredPresets.map(preset => (
            <button
              key={preset.key}
              onClick={() => handlePresetTest(preset.key)}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-600 text-center">
          Click any preset to see it in action on the demo text above
        </div>
      </div>
    </div>
  );
};

export default AnimationPresetDemo;
