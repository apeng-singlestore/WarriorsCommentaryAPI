// components/VideoPlayer.js

import { useRef, useEffect, useState, useCallback } from 'react';
import CommentarySidebar from './CommentarySidebar';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function VideoPlayer({ videoSrc }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [showAIMessages, setShowAIMessages] = useState(true);
  const [isAIWatching, setIsAIWatching] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({});
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const commentaryIntervalRef = useRef(null);

  const fetchLatestAnalytics = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching latest analytics:', error);
    }
  }, []);

  useEffect(() => {
    fetchLatestAnalytics();
    const intervalId = setInterval(() => {
      fetchLatestAnalytics();
    }, 2000); // Fetch analytics every 2 seconds

    return () => clearInterval(intervalId);
  }, [fetchLatestAnalytics]);

  // Function to start commentary fetching interval
  const startCommentaryInterval = useCallback(() => {
    if (!commentaryIntervalRef.current) {
      commentaryIntervalRef.current = setInterval(() => {
        fetchCommentary();
      }, 2000);
    }
  }, []);

  // Function to stop commentary fetching interval
  const stopCommentaryInterval = useCallback(() => {
    if (commentaryIntervalRef.current) {
      clearInterval(commentaryIntervalRef.current);
      commentaryIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handlePlay = () => {
        setIsVideoPlaying(true);
        startCommentaryInterval();
      };

      const handlePause = () => {
        setIsVideoPlaying(false);
        stopCommentaryInterval();
      };

      video.addEventListener('play', handlePlay);
      video.addEventListener('playing', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handlePause);

      // Cleanup event listeners on component unmount
      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('playing', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handlePause);
        stopCommentaryInterval();
      };
    }
  }, [startCommentaryInterval, stopCommentaryInterval]);

  const fetchCommentary = useCallback(async () => {
    try {
      setIsAIWatching(true);
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');

      const response = await fetch('/api/commentary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          width: canvas.width,
          height: canvas.height,
        }),
      });

      const data = await response.json();

      if (data.text) {
        setCommentary((prev) => [
          ...prev,
          {
            timestamp: data.timestamp || new Date().toISOString(),
            text: data.text,
            type: 'ai',
          },
        ]);
      } else {
        console.error('No commentary text received from API.');
        setError('No commentary received. Please try again.');
      }

      setIsAIWatching(false);
    } catch (error) {
      console.error('Error generating commentary:', error);
      setError(
        'Error generating commentary. Please check the console for details.'
      );
      setIsAIWatching(false);
    }
  }, []);

  // Define the onSendMessage function to handle user messages
  const onSendMessage = useCallback((message) => {
    setCommentary((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        text: message,
        type: 'user',
      },
    ]);
  }, []);

  // Function to handle text-to-speech when the "Speak" button is clicked
  const handleTextToSpeech = useCallback(() => {
    if (commentary.length === 0) {
      alert('No commentary available for speech synthesis.');
      return;
    }

    const lastCommentary = commentary[commentary.length - 1].text;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(lastCommentary);
    synth.speak(utterance);
  }, [commentary]);

  // Chart components

  const TotalCommentariesChart = useCallback(({ commentaries }) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={commentaries}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="date" stroke="#00FF00" tick={{ fontFamily: 'Orbitron', fill: '#00FF00' }} />
        <YAxis stroke="#00FF00" tick={{ fontFamily: 'Orbitron', fill: '#00FF00' }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#000000', borderColor: '#00FF00' }}
          labelStyle={{ color: '#00FF00', fontFamily: 'Orbitron' }}
          itemStyle={{ color: '#00FF00', fontFamily: 'Orbitron' }}
        />
        <Legend wrapperStyle={{ fontFamily: 'Orbitron', color: '#00FF00' }} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#00FF00"
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  ), []);

  const LatestLatenciesChart = useCallback(({ latencies = [] }) => {
    const data = latencies.map((l) => ({
      timestamp: new Date(l.timestamp).toLocaleString(),
      latency: l.latency ?? 0,
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="timestamp" stroke="#00FF00" tick={{ fontFamily: 'Orbitron', fill: '#00FF00' }} />
          <YAxis stroke="#00FF00" tick={{ fontFamily: 'Orbitron', fill: '#00FF00' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#000000', borderColor: '#00FF00' }}
            labelStyle={{ color: '#00FF00', fontFamily: 'Orbitron' }}
            itemStyle={{ color: '#00FF00', fontFamily: 'Orbitron' }}
          />
          <Legend wrapperStyle={{ fontFamily: 'Orbitron', color: '#00FF00' }} />
          <Line
            type="monotone"
            dataKey="latency"
            stroke="#00FF00"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }, []);

  const LatestCommentariesChart = useCallback(({ commentaries = [] }) => {
    const data = commentaries.map((c) => ({
      timestamp: new Date(c.timestamp).toLocaleString(),
      length: c.commentary?.length || c.text?.length || 0,
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="timestamp" stroke="#00FF00" tick={{ fontFamily: 'Orbitron', fill: '#00FF00' }} />
          <YAxis stroke="#00FF00" tick={{ fontFamily: 'Orbitron', fill: '#00FF00' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#000000', borderColor: '#00FF00' }}
            labelStyle={{ color: '#00FF00', fontFamily: 'Orbitron' }}
            itemStyle={{ color: '#00FF00', fontFamily: 'Orbitron' }}
          />
          <Legend wrapperStyle={{ fontFamily: 'Orbitron', color: '#00FF00' }} />
          <Line
            type="monotone"
            dataKey="length"
            stroke="#00FF00"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }, []);

  const ScoresOverTimeChart = useCallback(({ scoresData = [] }) => {
    const data = scoresData.map((s) => ({
      timestamp: new Date(s.timestamp).toLocaleString(),
      warriorsScore: s.warriors_score ?? 0,
      cavaliersScore: s.cavaliers_score ?? 0,
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="timestamp" stroke="#00FF00" tick={{ fontFamily: 'Orbitron', fill: '#00FF00' }} />
          <YAxis stroke="#00FF00" tick={{ fontFamily: 'Orbitron', fill: '#00FF00' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#000000', borderColor: '#00FF00' }}
            labelStyle={{ color: '#00FF00', fontFamily: 'Orbitron' }}
            itemStyle={{ color: '#00FF00', fontFamily: 'Orbitron' }}
          />
          <Legend wrapperStyle={{ fontFamily: 'Orbitron', color: '#00FF00' }} />
          <Line
            type="monotone"
            dataKey="warriorsScore"
            stroke="#00FFFF" // Neon blue for Warriors
            name="Warriors"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="cavaliersScore"
            stroke="#FF3131" // Neon red for Cavaliers
            name="Cavaliers"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }, []);

  const WinProbabilityChart = useCallback(({ winProbabilityData = [] }) => {
    const data = winProbabilityData.map((wp) => ({
      timestamp: new Date(wp.timestamp).toLocaleString(),
      winProbability: wp.win_probability ?? 50,
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="timestamp" stroke="#00FF00" tick={{ fontFamily: 'Orbitron', fill: '#00FF00' }} />
          <YAxis domain={[0, 100]} stroke="#00FF00" tick={{ fontFamily: 'Orbitron', fill: '#00FF00' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#000000', borderColor: '#00FF00' }}
            labelStyle={{ color: '#00FF00', fontFamily: 'Orbitron' }}
            itemStyle={{ color: '#00FF00', fontFamily: 'Orbitron' }}
          />
          <Legend wrapperStyle={{ fontFamily: 'Orbitron', color: '#00FF00' }} />
          <Line
            type="monotone"
            dataKey="winProbability"
            stroke="#00FF00"
            name="Warriors Win Probability %"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-neon-green font-orbitron">
      <div className="flex flex-grow">
        <div className="w-2/3 p-4 flex flex-col">
          <div className="video-container">
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              crossOrigin="anonymous"
              className="w-full h-auto object-contain"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {isAIWatching && (
              <div className="ai-watching">
                AI is watching
              </div>
            )}
          </div>
        </div>
        <div
          className="w-1/3 p-4 flex flex-col"
          style={{ maxHeight: '80vh' }}
        >
          <CommentarySidebar
            commentary={commentary}
            showAIMessages={showAIMessages}
            onToggleAIMessages={() => setShowAIMessages(!showAIMessages)}
            onGenerateCommentary={handleTextToSpeech}
            isAIWatching={isAIWatching}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>
      <div className="bg-black p-4">
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="mb-4"
        >
          {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
        </button>
        {showAnalytics && (
          <div className="analytics-container">
            <div className="analytics-card">
              <h3 className="text-xl font-semibold mb-2">Total Commentaries</h3>
              <TotalCommentariesChart
                commentaries={analyticsData?.commentariesOverTime || []}
              />
            </div>

            <div className="analytics-card">
              <h3 className="text-xl font-semibold mb-2">Latest Latencies</h3>
              <LatestLatenciesChart
                latencies={analyticsData?.latestLatency || []}
              />
            </div>

            <div className="analytics-card">
              <h3 className="text-xl font-semibold mb-2">Latest Commentaries</h3>
              <LatestCommentariesChart
                commentaries={analyticsData?.latestCommentaries || []}
              />
            </div>

            <div className="analytics-card">
              <h3 className="text-xl font-semibold mb-2">Scores Over Time</h3>
              <ScoresOverTimeChart
                scoresData={analyticsData?.scoresOverTime || []}
              />
            </div>

            <div className="analytics-card">
              <h3 className="text-xl font-semibold mb-2">Warriors Win Probability</h3>
              <WinProbabilityChart
                winProbabilityData={analyticsData?.winProbabilityOverTime || []}
              />
            </div>

            {/* Placeholder for the 6th graph to complete the 3x2 grid */}
            <div className="analytics-card flex items-center justify-center">
              <p>Additional Graph Placeholder</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
