import { useState, useEffect } from "react";
import Layout from "../components/Layout";

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch("/api/analytics");
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  if (!analyticsData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total Commentaries</h2>
            <p className="text-3xl font-bold">
              {analyticsData.totalCommentaries}
            </p>
          </div>
          {/* <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Average Commentary Length</h2>
            <p className="text-3xl font-bold">{analyticsData.averageCommentaryLength.toFixed(2)} characters</p>
          </div> */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Latest Commentaries</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Timestamp</th>
                <th className="px-4 py-2 text-left">Commentary</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.latestCommentaries.map((commentary, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-2">
                    {new Date(commentary.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{commentary.commentary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
