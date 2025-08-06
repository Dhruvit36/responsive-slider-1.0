import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

const VideoMock = vi.fn((props) => <div data-testid="video" {...props} />);
const ContentLayerMock = vi.fn(({ onElementReady, layerIndex }) => {
  onElementReady(`el-${layerIndex}`, layerIndex);
  return <div data-testid={`layer-${layerIndex}`} />;
});
const MultiLayerMock = vi.fn((props) => <div data-testid="multi" {...props} />);
const LayerAnimMock = vi.fn(() => null);

vi.mock('../VideoBackground', () => ({ default: VideoMock }));
vi.mock('../ContentLayer', () => ({ default: ContentLayerMock }));
vi.mock('../MultiLayerAnimations', () => ({ default: MultiLayerMock }));
vi.mock('../LayerAnimations', () => ({ default: LayerAnimMock }));

import SlideRenderer from '../SlideRenderer.jsx';

describe('SlideRenderer', () => {
  it('renders image slide and calls onSlideReady', () => {
    const onReady = vi.fn();
    render(<SlideRenderer slide={{ image: 'img.jpg' }} index={0} isActive={false} onSlideReady={onReady} />);
    expect(VideoMock).not.toHaveBeenCalled();
    expect(onReady).toHaveBeenCalled();
    expect(LayerAnimMock).toHaveBeenCalled();
  });

  it('handles video slide waiting for video', () => {
    const onReady = vi.fn();
    const { rerender } = render(<SlideRenderer slide={{ video: 'v.mp4' }} index={0} isActive={false} onSlideReady={onReady} />);
    expect(onReady).not.toHaveBeenCalled();
    VideoMock.mock.calls[0][0].onVideoReady();
    rerender(<SlideRenderer slide={{ video: 'v.mp4' }} index={0} isActive={false} onSlideReady={onReady} />);
    expect(onReady).toHaveBeenCalled();
  });

  it('registers layer elements for multi-layer slide', () => {
    render(<SlideRenderer slide={{ layers: [{}, {}] }} index={0} isActive={false} />);
    expect(ContentLayerMock).toHaveBeenCalledTimes(2);
    expect(MultiLayerMock).toHaveBeenCalled();
    const layerElements = MultiLayerMock.mock.calls[0][0].layerElements;
    expect(layerElements.get(0)).toBe('el-0');
    expect(layerElements.get(1)).toBe('el-1');
  });
});
