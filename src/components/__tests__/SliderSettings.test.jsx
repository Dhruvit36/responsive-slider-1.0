import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';

const updateSettings = vi.fn();
vi.mock('../context/SliderContext', () => ({
  useSliderContext: () => ({
    settings: { autoplay: { enabled: true, delay: 5000 }, navigation: { enabled: true, arrows: true, pagination: true } },
    updateSettings
  })
}));

import SliderSettings from '../SliderSettings.jsx';

describe('SliderSettings', () => {
  it('updates nested settings and applies', () => {
    const { getByLabelText, getByText } = render(<SliderSettings isOpen={true} onClose={() => {}} />);
    fireEvent.click(getByLabelText('Enable Autoplay'));
    fireEvent.click(getByLabelText('Enable Navigation'));
    fireEvent.click(getByText('Apply'));
    expect(updateSettings).toHaveBeenCalledWith(expect.objectContaining({ autoplay: { enabled: false, delay: 5000 }, navigation: { enabled: false, arrows: true, pagination: true } }));
  });

  it('resets to defaults', () => {
    const { getByText } = render(<SliderSettings isOpen={true} onClose={() => {}} />);
    fireEvent.click(getByText('Reset'));
    fireEvent.click(getByText('Apply'));
    expect(updateSettings).toHaveBeenCalledWith(expect.objectContaining({ autoplay: { enabled: true, delay: 5000 }, navigation: { enabled: true, arrows: true, pagination: true }, loop: true }));
  });
});
