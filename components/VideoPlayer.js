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

    const handlePlay = () => {
      console.log("Video playback started");
    };

    const handlePause = () => {
      console.log("Video playback paused");
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
    };
  }, []);

  const fetchCommentary = async () => {
    try {
      setIsAIWatching(true);
      const canvas = document.createElement("canvas");
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
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
      setError("Error generating commentary. Please check the console for details.");
      setIsAIWatching(false);
    }
  };

  const playSpeechFromServer = async (text) => {
    setIsSpeaking(true);
    const video = videoRef.current;
    video.muted = true; // Mute the video during speech playback

    try {
      // Fetch the audio stream from our new API route
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioSource = audioContext.createBufferSource();

      const arrayBuffer = await response.arrayBuffer();
      audioContext.decodeAudioData(arrayBuffer, (decodedData) => {
        audioSource.buffer = decodedData;
        audioSource.connect(audioContext.destination);
        audioSource.start(0);
      });

      audioSource.onended = () => {
        video.muted = false; // Unmute the video after speech finishes
        setIsSpeaking(false);
      };
    } catch (err) {
      console.error("Error playing speech from server:", err);
      video.muted = false; // Ensure video is unmuted if speech fails
      setIsSpeaking(false);
    }
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
      </div>
      <div className="sidebar-container p-4">
        <CommentarySidebar
          commentary={commentary}
          showAIMessages={showAIMessages}
          onToggleAIMessages={() => setShowAIMessages(!showAIMessages)}
          onGenerateCommentary={fetchCommentary}
          isAIWatching={isAIWatching}
          isSpeaking={isSpeaking}
        />
      </div>
    </div>
  );
}
