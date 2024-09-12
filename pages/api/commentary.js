import { generateCommentary } from "../../lib/commentaryGenerator";
import { GROQ_API_KEY } from "../../lib/config";

export default async function handler(req, res) {
  console.log("Commentary API handler called");
  console.log("GROQ_API_KEY is set:", !!GROQ_API_KEY);

  if (req.method === "POST") {
    try {
      const { imageData, width, height } = req.body;
      console.log("Generating commentary for image:", width, "x", height);
      const commentary = await generateCommentary(imageData, width, height);
      console.log("Commentary generated:", commentary);
      res.status(200).json(commentary);
    } catch (error) {
      console.error("Error in generating commentary:", error);
      res.status(500).json({
        text: "Error generating commentary.",
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
