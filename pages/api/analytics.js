import { commentaryTable } from "../../lib/singleStoreClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      console.log("Fetching analytics data from SingleStore...");

      // Fetch the last 10 commentary entries
      const latestCommentaries = await commentaryTable.find({
        select: ["timestamp", "commentary"],
        orderBy: { timestamp: "desc" },
        limit: 10,
      });

      console.log("Fetched latest commentaries:", latestCommentaries);

      // Calculate some basic analytics
      const totalCommentaries = await commentaryTable.find({
        select: ["timestamp"],
      }).length;
      console.log("Total commentaries:", totalCommentaries);

      const analyticsData = {
        latestCommentaries,
        totalCommentaries,
      };

      res.status(200).json(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      res.status(500).json({ error: "Error fetching analytics data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
