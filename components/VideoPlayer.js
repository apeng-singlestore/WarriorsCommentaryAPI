import { useRef, useEffect, useState } from "react";
import CommentarySidebar from "./CommentarySidebar";
import Draggable from "react-draggable";
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
} from "recharts";

export default function VideoPlayer({ videoSrc }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [showAIMessages, setShowAIMessages] = useState(true);
  const [isAIWatching, setIsAIWatching] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [timeRange, setTimeRange] = useState("all");
  const [enlargedChart, setEnlargedChart] = useState(null);

  const fetchLatestAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?userPrompt=${userPrompt}&timeRange=${timeRange}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching latest analytics:", error);
    }
  };

  useEffect(() => {
    fetchLatestAnalytics();

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
                const newCommentary = [
                  ...prevCommentary,
                  { ...data, type: "ai" },
                ];
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

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("error", handleError);
      cancelAnimationFrame(rafId);
    };
  }, [timeRange]);

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

  const TotalCommentariesChart = ({ commentaries }) => {
    const data = commentaries.map((c) => ({
      date: new Date(c.date).toLocaleDateString(),
      count: c.count,
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const LatestLatenciesChart = ({ latencies = [] }) => {
    const data = latencies
      .map((c) => ({
        timestamp: new Date(c.timestamp).toLocaleString(),
        latency: c.latency,
      }))
      .reverse();

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="latency"
            stroke="#8884d8"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const LatestCommentariesChart = ({ commentaries = [] }) => {
    const data = commentaries
      .map((c) => ({
        timestamp: new Date(c.timestamp).toLocaleString(),
        length: c.commentary.length,
      }))
      .reverse();

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="length"
            stroke="#8884d8"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const ScoresOverTimeChart = ({ scoresData = [] }) => {
    const data = scoresData.map((s) => ({
      timestamp: new Date(s.timestamp).toLocaleString(),
      warriorsScore: s.warriors_score,
      cavaliersScore: s.cavaliers_score,
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="warriorsScore" stroke="#1D428A" name="Warriors" isAnimationActive={false} />
          <Line type="monotone" dataKey="cavaliersScore" stroke="#860038" name="Cavaliers" isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const WinProbabilityChart = ({ winProbabilityData = [] }) => {
    const data = winProbabilityData.map((wp) => ({
      timestamp: new Date(wp.timestamp).toLocaleString(),
      winProbability: wp.win_probability,
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="winProbability" stroke="#00FF00" name="Warriors Win Probability %" isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const ChartModal = ({ chart, onClose }) => {
    if (!chart) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-4 rounded-lg" style={{ width: '80%', height: '80%' }}>
          <button onClick={onClose} className="absolute top-2 right-2 text-white">
            Close
          </button>
          {chart}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow h-2/3">
        <div className="w-2/3 p-4">
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            crossOrigin="anonymous"
            className="w-full h-full object-cover bg-black border border-gray-700"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {isAIWatching && (
            <div className="absolute top-4 right-4 bg-gray-500 bg-opacity-50 text-white px-2 py-1 rounded animate-pulse">
              AI is watching
            </div>
          )}
        </div>
        <div className="w-1/3 p-4">
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
      <div className="flex-shrink-0 h-1/3 bg-black p-4 overflow-x-auto">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-neon-green">Vector Search</h3>
          <input
            type="text"
            value={userPrompt}
            onChange={(e) => {
              setUserPrompt(e.target.value);
              fetchLatestAnalytics();
            }}
            placeholder="Enter your prompt"
            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
          />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded"
          >
            <option value="all">All Time</option>
            <option value="hour">Last Hour</option>
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
        <div className="mb-4 max-h-40 overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Timestamp</th>
                <th className="px-4 py-2 text-left">Commentary</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData?.similaritySearch?.map((commentary, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-800" : ""}>
                  <td className="px-4 py-2">{new Date(commentary.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2">{commentary.commentary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap justify-between">
          <Draggable>
            <div className="bg-gray-800 p-4 rounded-lg cursor-move mb-4 mr-4" style={{ width: '30%', height: '250px' }}>
              <h3 className="text-xl font-semibold mb-2 text-neon-green">Total Commentaries</h3>
              <TotalCommentariesChart commentaries={analyticsData?.commentariesOverTime || []} />
              <button onClick={() => setEnlargedChart(<TotalCommentariesChart commentaries={analyticsData?.commentariesOverTime || []} />)} className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">
                Enlarge
              </button>
            </div>
          </Draggable>
          <Draggable>
            <div className="bg-gray-800 p-4 rounded-lg cursor-move mb-4 mr-4" style={{ width: '30%', height: '250px' }}>
              <h3 className="text-xl font-semibold mb-2 text-neon-green">Latest Latencies</h3>
              <LatestLatenciesChart latencies={analyticsData?.latestLatency || []} />
              <button onClick={() => setEnlargedChart(<LatestLatenciesChart latencies={analyticsData?.latestLatency || []} />)} className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">
                Enlarge
              </button>
            </div>
          </Draggable>
          <Draggable>
            <div className="bg-gray-800 p-4 rounded-lg cursor-move mb-4" style={{ width: '30%', height: '250px' }}>
              <h3 className="text-xl font-semibold mb-2 text-neon-green">Latest Commentaries</h3>
              <LatestCommentariesChart commentaries={analyticsData?.latestCommentaries || []} />
              <button onClick={() => setEnlargedChart(<LatestCommentariesChart commentaries={analyticsData?.latestCommentaries || []} />)} className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">
                Enlarge
              </button>
            </div>
          </Draggable>
          <Draggable>
            <div className="bg-gray-800 p-4 rounded-lg cursor-move mb-4 mr-4" style={{ width: '30%', height: '250px' }}>
              <h3 className="text-xl font-semibold mb-2 text-neon-green">Scores Over Time</h3>
              <ScoresOverTimeChart scoresData={analyticsData?.scoresOverTime || []} />
              <button onClick={() => setEnlargedChart(<ScoresOverTimeChart scoresData={analyticsData?.scoresOverTime || []} />)} className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">
                Enlarge
              </button>
            </div>
          </Draggable>
          <Draggable>
            <div className="bg-gray-800 p-4 rounded-lg cursor-move mb-4" style={{ width: '30%', height: '250px' }}>
              <h3 className="text-xl font-semibold mb-2 text-neon-green">Warriors Win Probability</h3>
              <WinProbabilityChart winProbabilityData={analyticsData?.winProbabilityOverTime || []} />
              <button onClick={() => setEnlargedChart(<WinProbabilityChart winProbabilityData={analyticsData?.winProbabilityOverTime || []} />)} className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">
                Enlarge
              </button>
            </div>
          </Draggable>
        </div>
      </div>
      <ChartModal chart={enlargedChart} onClose={() => setEnlargedChart(null)} />
    </div>
  );
}
