import { query, initializeDatabase } from "../../lib/singleStoreClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { userPrompt, timeRange } = req.query;

      const commentaryTable = await initializeDatabase();
      console.log("Fetching analytics data from SingleStore...");

      let timeFilter = "";
      switch (timeRange) {
        case "30s":
          timeFilter = "WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 SECOND)";
          break;
        case "1min":
          timeFilter = "WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)";
          break;
        case "5min":
          timeFilter = "WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)";
          break;
        case "10min":
          timeFilter = "WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 10 MINUTE)";
          break;
        default:
          timeFilter = "";
      }

      const vectorSearch = await commentaryTable.vectorSearch(
        {
          prompt: userPrompt || "warriors",
          vectorColumn: "embedding",
        },
        {
          select: ["commentary", "timestamp"],
          limit: 10,
          where: timeFilter,
        },
      );

      console.log("Similarity search performed with prompt:", vectorSearch);

      // Fetch commentaries over time
      const commentariesOverTime = await query(`
        SELECT DATE(timestamp) as date, COUNT(*) as count
        FROM commentary_data
        ${timeFilter}
        GROUP BY DATE(timestamp)
        ORDER BY date
      `);

      console.log("Fetched commentaries over time:", commentariesOverTime);

      // Fetch the last 10 commentary entries
      const latestCommentaries = await query(`
        SELECT timestamp, commentary
        FROM commentary_data
        ${timeFilter}
        ORDER BY timestamp DESC
        LIMIT 10
      `);

      console.log("Fetched latest commentaries:", latestCommentaries);

      const latestLatency = await query(`
        SELECT timestamp, latency
        FROM commentary_data
        ${timeFilter}
        ORDER BY timestamp DESC
        LIMIT 10
      `);

      console.log("Fetched latest latency:", latestLatency);

      // Calculate total commentaries
      const totalCommentaries = await query(`
        SELECT COUNT(*) AS total
        FROM commentary_data
        ${timeFilter}
      `);

      console.log("Total commentaries:", totalCommentaries);

      // Fetch scores over time
      const scoresOverTime = await query(`
        SELECT timestamp, warriors_score, cavaliers_score
        FROM commentary_data
        ${timeFilter}
        ORDER BY timestamp
      `);

      console.log("Fetched scores over time:", scoresOverTime);

      // Fetch win probability over time
      const winProbabilityOverTime = await query(`
        SELECT timestamp, win_probability
        FROM commentary_data
        ${timeFilter}
        ORDER BY timestamp
      `);

      console.log("Fetched win probability over time:", winProbabilityOverTime);

      const analyticsData = {
        latestCommentaries,
        totalCommentaries: totalCommentaries[0]?.total || 0,
        latestLatency,
        similaritySearch: vectorSearch,
        commentariesOverTime,
        scoresOverTime,
        winProbabilityOverTime,
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
