import { useRef, useEffect, useState } from "react";
import CommentarySidebar from "./CommentarySidebar";

export default function VideoPlayer({ videoSrc }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [showAIMessages, setShowAIMessages] = useState(true);
  const [isAIWatching, setIsAIWatching] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    let rafId;
    let lastCaptureTime = 0;

    const captureFrame = (time) => {
      if (time - lastCaptureTime >= 2000) {
        if (video.readyState >= video.HAVE_CURRENT_DATA) {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas
            .getContext("2d")
            .drawImage(video, 0, 0, canvas.width, canvas.height);

          console.log("Capturing frame:", canvas.width, "x", canvas.height);

          const imageData = canvas.toDataURL("image/jpeg");

          setIsAIWatching(true);
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
                "Error generating commentary. Please check the console for details.",
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

  const fetchCommentary = async () => {
    try {
      setIsAIWatching(true);
      const canvas = document.createElement("canvas");
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");

      const response = await fetch("/api/commentary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData,
          width: canvas.width,
          height: canvas.height,
        }),
      });

      const data = await response.json();
      if (data.text) {
        setCommentary((prev) => [...prev, { ...data, type: "ai" }]);
        playSpeechFromServer(data.text);
      }

      setIsAIWatching(false);
    } catch (error) {
      console.error("Error generating commentary:", error);
      setError(
        "Error generating commentary. Please check the console for details.",
      );
      setIsAIWatching(false);
    }
  };

  const playSpeechFromServer = async (text) => {
    setIsSpeaking(true);
    const video = videoRef.current;
    video.muted = true;

    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const audioSource = audioContext.createBufferSource();

      const arrayBuffer = await response.arrayBuffer();
      audioContext.decodeAudioData(arrayBuffer, (decodedData) => {
        audioSource.buffer = decodedData;
        audioSource.connect(audioContext.destination);
        audioSource.start(0);
      });

      audioSource.onended = () => {
        video.muted = false;
        setIsSpeaking(false);
      };
    } catch (err) {
      console.error("Error playing speech from server:", err);
      video.muted = false;
      setIsSpeaking(false);
    }
  };

  const handleUserMessage = (message) => {
    const userComment = {
      timestamp: new Date().toISOString(),
      text: message,
      type: "user",
    };
    setCommentary((prevCommentary) => [...prevCommentary, userComment]);
  };

  return (
    <div className="main-container">
      <div className="video-container p-4">
        <video
          ref={videoRef}
          src={videoSrc}
          controls
          crossOrigin="anonymous"
          className="w-full h-auto max-h-full bg-black border border-gray-700"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {isAIWatching && (
          <div className="absolute top-4 right-4 bg-gray-500 bg-opacity-50 text-white px-2 py-1 rounded animate-pulse">
            AI is watching
          </div>
        )}
      </div>
      <div className="sidebar-container p-4">
        <CommentarySidebar
          commentary={commentary}
          showAIMessages={showAIMessages}
          onToggleAIMessages={() => setShowAIMessages(!showAIMessages)}
          onGenerateCommentary={fetchCommentary}
          isAIWatching={isAIWatching}
          isSpeaking={isSpeaking}
          onSendMessage={handleUserMessage}
        />
      </div>
    </div>
  );
}
