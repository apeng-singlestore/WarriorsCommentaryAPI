import { useState, useEffect } from "react";
import Layout from "../components/Layout";
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

// Chart to display total number of commentaries
const TotalCommentariesChart = ({ total }) => (
  <ResponsiveContainer width="100%" height={300}>
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

// Chart to display latest commentaries
const LatestCommentariesChart = ({ commentaries = [] }) => {
  const data = commentaries.map((c) => ({
    timestamp: new Date(c.timestamp).toLocaleString(),
    length: c.commentary.length,
  })).reverse();

  return (
    <ResponsiveContainer width="100%" height={300}>
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

  // Fallback UI in case data is not available yet
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

        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total Commentaries</h2>
            <TotalCommentariesChart total={analyticsData.totalCommentaries} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Latest Commentaries</h2>
          <LatestCommentariesChart
            commentaries={analyticsData.latestCommentaries || []}
          />
          <table className="w-full mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Timestamp</th>
                <th className="px-4 py-2 text-left">Commentary</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData?.latestCommentaries?.map((commentary, index) => (
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
