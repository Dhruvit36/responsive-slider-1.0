import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';

vi.mock('../context/SliderContext', () => ({
  useSliderContext: () => ({
    slides: [1,2,3],
    currentSlide: 0,
    settings: { autoplay: { enabled: true } },
    updateSettings: vi.fn()
  })
}));

import NavigationControls from '../NavigationControls.jsx';

describe('NavigationControls', () => {
  const makeSwiper = () => ({
    swiper: {
      slidePrev: vi.fn(),
      slideNext: vi.fn(),
      slideTo: vi.fn(),
      autoplay: { start: vi.fn(), stop: vi.fn() }
    }
  });

  it('handles arrow navigation and pagination', () => {
    const ref = { current: makeSwiper() };
    const { getByLabelText } = render(<NavigationControls swiperRef={ref} />);
    fireEvent.click(getByLabelText('Previous slide'));
    fireEvent.click(getByLabelText('Next slide'));
    fireEvent.click(getByLabelText('Go to slide 2'));
    expect(ref.current.swiper.slidePrev).toHaveBeenCalled();
    expect(ref.current.swiper.slideNext).toHaveBeenCalled();
    expect(ref.current.swiper.slideTo).toHaveBeenCalledWith(1);
  });

  it('toggles autoplay', () => {
    const context = require('../context/SliderContext').useSliderContext();
    const ref = { current: makeSwiper() };
    const { getByLabelText } = render(<NavigationControls swiperRef={ref} />);
    fireEvent.click(getByLabelText('Pause autoplay'));
    expect(context.updateSettings).toHaveBeenCalled();
    expect(ref.current.swiper.autoplay.stop).toHaveBeenCalled();
  });
});
