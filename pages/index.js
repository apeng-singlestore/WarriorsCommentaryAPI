// pages/index.js

import Layout from "../components/Layout";
import VideoPlayer from "../components/VideoPlayer";

export default function Home() {
  const videoSrc = "/sample-video.mp4";

  return (
    <Layout>
      <VideoPlayer videoSrc={videoSrc} />
    </Layout>
  );
}
