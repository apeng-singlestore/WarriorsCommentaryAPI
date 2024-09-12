import Layout from "../components/Layout";
import VideoPlayer from "../components/VideoPlayer";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-2/3 p-4">
          <VideoPlayer videoSrc="/sample-video.mp4" />
        </div>
      </div>
    </Layout>
  );
}
