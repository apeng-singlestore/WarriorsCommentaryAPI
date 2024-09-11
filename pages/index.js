import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import VideoPlayer from '../components/VideoPlayer';
import CommentarySidebar from '../components/CommentarySidebar';

export default function Home() {
  const [commentary, setCommentary] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/commentary');
    eventSource.onmessage = (event) => {
      const newCommentary = JSON.parse(event.data);
      setCommentary((prevCommentary) => [...prevCommentary, newCommentary]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-2/3 p-4">
          <VideoPlayer videoSrc="/sample-video.mp4" />
        </div>
        <div className="w-full md:w-1/3 p-4">
          <CommentarySidebar commentary={commentary} />
        </div>
      </div>
    </Layout>
  );
}
