import { generateCommentary } from "../../lib/commentaryGenerator";
import { GROQ_API_KEY } from "../../lib/config";
import { getStoredCommentary } from "../../lib/singleStoreClient";

export default async function handler(req, res) {
  console.log("Commentary API handler called");
  console.log("GROQ_API_KEY is set:", !!GROQ_API_KEY);

  if (req.method === "POST") {
    try {
      const { imageData, width, height } = req.body;
      console.log("Received image data:", width, "x", height);

      if (!imageData) {
        throw new Error("No image data provided");
      }

      console.log("Generating commentary...");
      const newCommentary = await generateCommentary(imageData, width, height);
      console.log("New commentary generated:", newCommentary);

      if (newCommentary.error) {
        throw new Error(newCommentary.error);
      }

      // Retrieve stored commentary
      const storedCommentary = await getStoredCommentary(5); // Get last 5 stored commentaries
      console.log("Retrieved stored commentary:", storedCommentary);

      res.status(200).json({
        newCommentary,
        storedCommentary
      });
    } catch (error) {
      console.error("Error in generating or retrieving commentary:", error);
      res.status(500).json({
        text: `Error: ${error.message}`,
        error: true,
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
