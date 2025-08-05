import { useRef, useEffect, useState, useCallback } from 'react';
import VideoControls from './VideoControls';

const VideoBackground = ({ 
  videoSrc, 
  posterImage,
  autoplay = true,
  muted = true,
  loop = true,
  controls = false,
  showCustomControls = false,
  playbackRate = 1,
  onVideoReady,
  onVideoError,
  isActive = false 
}) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle video ready
  const handleVideoReady = useCallback(() => {
    if (videoRef.current) {
      setIsLoaded(true);
      if (onVideoReady) {
        onVideoReady(videoRef.current);
      }
    }
  }, [onVideoReady]);

  // Handle video error
  const handleVideoError = useCallback((error) => {
    console.error('Video loading error:', error);
    setHasError(true);
    if (onVideoError) {
      onVideoError(error);
    }
  }, [onVideoError]);

  // Handle play/pause based on slide activity
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLoaded) return;

    const playVideo = async () => {
      try {
        if (isActive && autoplay) {
          await video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      } catch (error) {
        console.warn('Video play/pause error:', error);
      }
    };

    playVideo();
  }, [isActive, autoplay, isLoaded]);

  // Set playback rate
  useEffect(() => {
    const video = videoRef.current;
    if (video && isLoaded) {
      video.playbackRate = playbackRate;
    }
  }, [playbackRate, isLoaded]);

  // Video event handlers
  const handleLoadedData = () => {
    handleVideoReady();
  };

  const handleError = (e) => {
    handleVideoError(e.target.error);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  // Support for multiple video formats
  const getVideoSources = () => {
    if (typeof videoSrc === 'string') {
      return [{ src: videoSrc, type: getVideoType(videoSrc) }];
    }
    return videoSrc; // Array of sources
  };

  const getVideoType = (src) => {
    const extension = src.split('.').pop().toLowerCase();
    const types = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogv': 'video/ogg'
    };
    return types[extension] || 'video/mp4';
  };

  if (hasError) {
    // Fallback to poster image if video fails
    return (
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: posterImage ? `url(${posterImage})` : 'none',
          backgroundColor: '#1a1a1a'
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        poster={posterImage}
        autoPlay={false} // We handle this manually
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
        preload="metadata"
        onLoadedData={handleLoadedData}
        onError={handleError}
        onPlay={handlePlay}
        onPause={handlePause}
      >
        {getVideoSources().map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))}
        {/* Fallback message */}
        <p className="text-white text-center p-4">
          Your browser does not support the video tag.
        </p>
      </video>
      
      {/* Video loading overlay */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}

      {/* Custom Video Controls */}
      {showCustomControls && isLoaded && !hasError && (
        <VideoControls
          videoRef={videoRef}
          showControls={true}
          position="bottom-right"
          autoHide={true}
        />
      )}
    </div>
  );
};

export default VideoBackground;
