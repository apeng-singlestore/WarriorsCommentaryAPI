import Groq from "groq-sdk";
import { GROQ_API_KEY } from "./config";

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export async function generateCommentaryWithGroq(encodedImage) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      console.log(
        "Preparing request to Groq API (Attempt " + (retries + 1) + ")",
      );
      console.log("Encoded image length:", encodedImage.length);
      console.log("GROQ_API_KEY set:", !!GROQ_API_KEY);

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Describe this image.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `${encodedImage}`,
                },
              },
            ],
          },
        ],
        model: "llava-v1.5-7b-4096-preview",
        max_tokens: 150,
      });

      console.log("Received response from Groq API");
      console.log(
        "Response content:",
        chatCompletion.choices[0]?.message?.content,
      );
      return (
        chatCompletion.choices[0]?.message?.content ||
        "No commentary generated."
      );
    } catch (error) {
      console.error(
        "Error generating commentary with Groq (Attempt " +
          (retries + 1) +
          "):",
        error,
      );
      console.error("Error details:", JSON.stringify(error, null, 2));
      retries++;
      if (retries < MAX_RETRIES) {
        console.log("Retrying in " + RETRY_DELAY + "ms...");
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  return "Error generating commentary after " + MAX_RETRIES + " attempts.";
}
