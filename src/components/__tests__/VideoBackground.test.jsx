import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import VideoBackground from '../VideoBackground.jsx';

describe('VideoBackground', () => {
  it('plays and pauses based on isActive', async () => {
    vi.spyOn(global.HTMLMediaElement.prototype, 'play').mockResolvedValue();
    vi.spyOn(global.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    const { container, rerender } = render(<VideoBackground videoSrc="v.mp4" isActive={true} />);
    const video = container.querySelector('video');
    fireEvent.loadedData(video);
    await Promise.resolve();
    expect(global.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    rerender(<VideoBackground videoSrc="v.mp4" isActive={false} />);
    fireEvent.loadedData(container.querySelector('video'));
    expect(global.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it('falls back to poster image on error', () => {
    const { container } = render(<VideoBackground videoSrc="v.mp4" posterImage="p.jpg" />);
    const video = container.querySelector('video');
    fireEvent.error(video, { target: { error: new Error('err') } });
    expect(container.querySelector('video')).toBeNull();
    const div = container.querySelector('div');
    expect(div.style.backgroundImage).toContain('p.jpg');
  });
});
