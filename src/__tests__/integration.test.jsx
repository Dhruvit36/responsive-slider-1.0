import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SliderProvider, useSliderContext } from '../context/SliderContext.jsx';

vi.mock('../utils/persistence', () => ({
  default: { loadState: vi.fn(() => null), saveState: vi.fn() },
  createDebouncedSave: (fn) => fn
}));

global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({ slides: [{ title: 'A' }, { title: 'B' }] }) }));

describe('Slider integration', () => {
  it('allows navigation and settings update', async () => {
    const Child = () => {
      const { currentSlide, setCurrentSlide, settings, updateSettings } = useSliderContext();
      return (
        <div>
          <span data-testid="slide">{currentSlide}</span>
          <span data-testid="autoplay">{String(settings.autoplay.enabled)}</span>
          <button onClick={() => setCurrentSlide(1)}>next</button>
          <button onClick={() => updateSettings({ autoplay: { ...settings.autoplay, enabled: false } })}>toggle</button>
        </div>
      );
    };

    render(<SliderProvider><Child /></SliderProvider>);
    screen.getByText('next').click();
    expect(screen.getByTestId('slide').textContent).toBe('1');
    screen.getByText('toggle').click();
    expect(screen.getByTestId('autoplay').textContent).toBe('false');
  });
});
