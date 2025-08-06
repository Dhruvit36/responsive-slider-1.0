import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React, { createRef } from 'react';
import VideoControls from '../VideoControls.jsx';

describe('VideoControls', () => {
  const setup = () => {
    const video = {
      paused: true,
      muted: true,
      play: vi.fn().mockResolvedValue(),
      pause: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
    const ref = { current: video };
    return { ref, video };
  };

  it('toggles play/pause', async () => {
    const { ref, video } = setup();
    const { getByLabelText } = render(<VideoControls videoRef={ref} showControls={true} autoHide={false} />);
    fireEvent.click(getByLabelText('Play video'));
    expect(video.play).toHaveBeenCalled();
    video.paused = false;
    fireEvent.click(getByLabelText('Pause video'));
    expect(video.pause).toHaveBeenCalled();
  });

  it('toggles mute', () => {
    const { ref, video } = setup();
    const { getByLabelText } = render(<VideoControls videoRef={ref} showControls={true} autoHide={false} />);
    fireEvent.click(getByLabelText('Unmute video'));
    expect(video.muted).toBe(false);
    fireEvent.click(getByLabelText('Mute video'));
    expect(video.muted).toBe(true);
  });

  it('auto hides controls', () => {
    vi.useFakeTimers();
    const { ref } = setup();
    const { container } = render(<VideoControls videoRef={ref} showControls={true} autoHide={true} />);
    expect(container.firstChild).not.toBeNull();
    vi.advanceTimersByTime(3000);
    expect(container.firstChild).toBeNull();
    vi.useRealTimers();
  });
});
