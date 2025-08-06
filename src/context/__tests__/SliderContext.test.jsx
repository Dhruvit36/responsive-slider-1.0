import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SliderProvider, useSliderContext } from '../SliderContext.jsx';

vi.mock('../../utils/persistence', () => {
  const loadState = vi.fn(() => ({
    currentSlide: 1,
    settings: { autoplay: { delay: 1000, enabled: false }, loop: false }
  }));
  const saveState = vi.fn();
  return {
    default: { loadState, saveState },
    sliderPersistence: { loadState, saveState },
    createDebouncedSave: (fn) => fn
  };
});

const TestComponent = () => {
  const { settings, currentSlide, updateSettings, addEventListener, dispatchEvent, setCurrentSlide } = useSliderContext();
  return (
    <div>
      <span data-testid="delay">{settings.autoplay.delay}</span>
      <span data-testid="enabled">{String(settings.autoplay.enabled)}</span>
      <span data-testid="current">{currentSlide}</span>
      <button onClick={() => updateSettings({ autoplay: { delay: 2000 } })}>update</button>
      <button onClick={() => {
        const cb = vi.fn();
        addEventListener('custom', cb);
        dispatchEvent('custom', { foo: 'bar' });
        dispatchEvent('custom', { foo: 'baz' });
        cb.mock.calls.forEach(call => { document.body.append(JSON.stringify(call[0])); });
      }}>dispatch</button>
      <button onClick={() => setCurrentSlide(2)}>slide</button>
    </div>
  );
};

describe('SliderContext', () => {
  it('merges persisted settings and updates them', () => {
    render(<SliderProvider><TestComponent /></SliderProvider>);
    expect(screen.getByTestId('delay').textContent).toBe('1000');
    expect(screen.getByTestId('enabled').textContent).toBe('false');
    screen.getByText('update').click();
    expect(screen.getByTestId('delay').textContent).toBe('2000');
  });

  it('handles events and slide change events', () => {
    vi.useFakeTimers();
    const beforeFn = vi.fn();
    const afterFn = vi.fn();

    const Wrapper = () => {
      const { addEventListener, setCurrentSlide } = useSliderContext();
      addEventListener('beforeSlideChange', beforeFn);
      addEventListener('slideChange', afterFn);
      return <button onClick={() => setCurrentSlide(3)}>go</button>;
    };

    render(<SliderProvider><Wrapper /></SliderProvider>);
    screen.getByText('go').click();
    expect(beforeFn).toHaveBeenCalledWith(expect.objectContaining({ from: 1, to: 3 }));
    vi.runAllTimers();
    expect(afterFn).toHaveBeenCalledWith(expect.objectContaining({ from: 1, to: 3 }));
    vi.useRealTimers();
  });
});
