import { useRef, useEffect, useState } from "react";
import CommentarySidebar from "./CommentarySidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { query } from "../lib/singleStoreClient";

export default function VideoPlayer({ videoSrc }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [showAIMessages, setShowAIMessages] = useState(true);
  const [isAIWatching, setIsAIWatching] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dynamicGraph, setDynamicGraph] = useState(null);

  const fetchLatestAnalytics = async () => {
    try {
      const latestCommentaries = await query(`
        SELECT timestamp, commentary
        FROM commentary_data
        ORDER BY timestamp DESC
        LIMIT 10
      `);

      const totalCommentaries = await query(`
        SELECT COUNT(*) AS total
        FROM commentary_data
      `);

      setAnalyticsData({
        latestCommentaries,
        totalCommentaries: totalCommentaries[0]?.total || 0,
      });
    } catch (error) {
      console.error('Error fetching latest analytics:', error);
    }
  };

  const fetchDynamicGraph = async (question) => {
    try {
      const response = await fetch('/api/generate-graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dynamic graph');
      }

      const graphConfig = await response.json();
      setDynamicGraph(graphConfig);
    } catch (error) {
      console.error('Error fetching dynamic graph:', error);
      setError('Failed to generate dynamic graph');
    }
  };

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
              setCommentary((prevCommentary) => {
                const newCommentary = [...prevCommentary, { ...data, type: "ai" }];
                fetchLatestAnalytics();
                return newCommentary;
              });
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

    fetchLatestAnalytics();
    fetchDynamicGraph("Show the trend of commentary lengths over time");

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
        setCommentary((prev) => {
          const newCommentary = [...prev, { ...data, type: "ai" }];
          fetchLatestAnalytics();
          return newCommentary;
        });
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
    setCommentary((prevCommentary) => {
      const newCommentary = [...prevCommentary, userComment];
      fetchLatestAnalytics();
      return newCommentary;
    });
  };

  const TotalCommentariesChart = ({ total }) => (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={[{ name: "Total Commentaries", total }]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );

  const LatestCommentariesChart = ({ commentaries = [] }) => {
    const data = commentaries
      .map((c) => ({
        timestamp: new Date(c.timestamp).toLocaleString(),
        length: c.commentary.length,
      }))
      .reverse();

    return (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="length" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const DynamicGraph = ({ config }) => {
    if (!config) return null;

    const ChartComponent = {
      BarChart,
      LineChart,
      AreaChart,
      PieChart,
    }[config.type];

    if (!ChartComponent) return <p>Unsupported chart type</p>;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={config.data}>
          {config.cartesianGrid && <CartesianGrid strokeDasharray="3 3" />}
          {config.xAxis && <XAxis {...config.xAxis} />}
          {config.yAxis && <YAxis {...config.yAxis} />}
          <Tooltip />
          <Legend />
          {config.series.map((series, index) => {
            const SeriesComponent = {
              Bar,
              Line,
              Area,
              Pie,
            }[series.type];

            return <SeriesComponent key={index} {...series.props} />;
          })}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="main-container">
        <div className="video-container p-4 relative">
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
      <div className="analytics-container mt-8 p-4 bg-black rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-neon-green">Real-time Analytics</h2>
        {analyticsData ? (
          <>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2 text-neon-green">Total Commentaries</h3>
              <TotalCommentariesChart total={analyticsData.totalCommentaries} />
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2 text-neon-green">Latest Commentaries</h3>
              <LatestCommentariesChart commentaries={analyticsData.latestCommentaries} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-neon-green">Dynamic Graph</h3>
              <DynamicGraph config={dynamicGraph} />
            </div>
          </>
        ) : (
          <p className="text-white">Loading analytics data...</p>
        )}
      </div>
    </div>
  );
}