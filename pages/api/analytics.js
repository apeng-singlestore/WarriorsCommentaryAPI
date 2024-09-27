import { query, initializeDatabase } from "../../lib/singleStoreClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { userPrompt } = req.query;

      const commentaryTable = await initializeDatabase();
      console.log("Fetching analytics data from SingleStore...");

      const vectorSearch = await commentaryTable.vectorSearch(
        {
          prompt: userPrompt || "warriors",
          vectorColumn: "embedding",
        },
        {
          select: ["commentary", "timestamp"],
          limit: 10,
        },
      );

      console.log("Similarity search performed with prompt:", vectorSearch);

      // Fetch the last 10 commentary entries
      const latestCommentaries = await query(`
        SELECT timestamp, commentary
        FROM commentary_data
        ORDER BY timestamp DESC
        LIMIT 10
      `);

      console.log("Fetched latest commentaries:", latestCommentaries);

      const latestLatency = await query(`
        SELECT timestamp, latency
        FROM commentary_data
        ORDER BY timestamp DESC
        LIMIT 10
      `);

      console.log("Fetched latest latency:", latestLatency);

      // Calculate total commentaries
      const totalCommentaries = await query(`
        SELECT COUNT(*) AS total
        FROM commentary_data
      `);

      console.log("Total commentaries:", totalCommentaries);

      const analyticsData = {
        latestCommentaries,
        totalCommentaries: totalCommentaries[0]?.total || 0,
        latestLatency,
        similaritySearch: vectorSearch,
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
