import { useRef, useEffect, useState } from 'react';
import { processFrame } from '../lib/frameProcessor';

export default function VideoPlayer({ videoSrc }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    let rafId;
    let lastCaptureTime = 0;

    const captureFrame = (time) => {
      if (time - lastCaptureTime >= 5000) {
        if (video.readyState >= video.HAVE_CURRENT_DATA) {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
          
          processFrame(canvas);
          
          lastCaptureTime = time;
        }
      }
      rafId = requestAnimationFrame(captureFrame);
    };

    const handlePlay = () => {
      rafId = requestAnimationFrame(captureFrame);
    };

    const handlePause = () => {
      cancelAnimationFrame(rafId);
    };

    const handleError = (e) => {
      console.error('Video error:', e);
      setError('Error loading video. Please check the video source.');
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        src={videoSrc}
        controls
        crossOrigin="anonymous"
        className="w-full h-auto"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
