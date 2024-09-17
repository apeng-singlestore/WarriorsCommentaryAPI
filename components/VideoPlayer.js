import { useRef, useEffect, useState } from "react";
import CommentarySidebar from "./CommentarySidebar";

export default function VideoPlayer({ videoSrc }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [showAIMessages, setShowAIMessages] = useState(true);
  const [isAIWatching, setIsAIWatching] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    let rafId;
    let lastCaptureTime = 0;

    const captureFrame = (time) => {
      if (time - lastCaptureTime >= 2000) {
        if (video.readyState >= video.HAVE_CURRENT_DATA) {
          setIsAIWatching(true);
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas
            .getContext("2d")
            .drawImage(video, 0, 0, canvas.width, canvas.height);

          console.log("Capturing frame:", canvas.width, "x", canvas.height);

          const imageData = canvas.toDataURL("image/jpeg");

          fetch("/api/commentary", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageData,
              width: canvas.width,
              height: canvas.height,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Commentary generated:", data);
              setCommentary((prevCommentary) => [
                ...prevCommentary,
                { ...data, type: "ai" },
              ]);
              setIsAIWatching(false);
            })
            .catch((error) => {
              console.error("Error generating commentary:", error);
              setError(
                "Error generating commentary. Please check the console for details."
              );
              setIsAIWatching(false);
            });

          lastCaptureTime = time;
        }
      }
      rafId = requestAnimationFrame(captureFrame);
    };

    const handlePlay = () => {
      console.log("Video playback started");
      rafId = requestAnimationFrame(captureFrame);
    };

    const handlePause = () => {
      console.log("Video playback paused");
      cancelAnimationFrame(rafId);
      setIsAIWatching(false);
    };

    const handleError = (e) => {
      console.error("Video error:", e);
      setError("Error loading video. Please check the video source.");
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("error", handleError);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleUserMessage = (message) => {
    const userComment = {
      timestamp: new Date().toISOString(),
      text: message,
      type: "user",
    };
    setCommentary((prevCommentary) => [...prevCommentary, userComment]);
  };

  const toggleAIMessages = () => {
    setShowAIMessages(!showAIMessages);
  };

  return (
    <div className="flex flex-row h-screen videoplayer">
      <div className="w-2/3 p-4 relative">
        <video
          ref={videoRef}
          src={videoSrc}
          controls
          crossOrigin="anonymous"
          className="w-full h-auto max-h-full"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {isAIWatching && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded">
            AI is watching
          </div>
        )}
      </div>
      <div className="w-1/3 p-4 overflow-hidden">
        <CommentarySidebar
          commentary={showAIMessages ? commentary : commentary.filter(c => c.type !== 'ai')}
          onSendMessage={handleUserMessage}
          showAIMessages={showAIMessages}
          onToggleAIMessages={toggleAIMessages}
        />
      </div>
    </div>
  );
}
