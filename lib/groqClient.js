import Groq from "groq-sdk";
import OpenAI from "openai";
import { GROQ_API_KEY } from "./config";
import { initializeDatabase } from "./singleStoreClient"; // Import the database initialization function

import { AI } from "@singlestore/ai";
const ai = new AI({ openAIApiKey: process.env.OPENAI_API_KEY });

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function generateEmbedding(text) {
  try {
    const response = await ai.embeddings.create(text);
    return response[0];
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}

export async function generateCommentaryWithGroq(encodedImage) {
  let retries = 0;
  let commentaryTable;

  // Initialize commentaryTable only once
  try {
    commentaryTable = await initializeDatabase(); // Ensure the table is initialized
  } catch (error) {
    console.error("Error initializing the database:", error);
    throw error;
  }

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
                text: 'You are an expert NBA sports commentator API capable of basketball analysis that responds in JSON. The game score is in a box to the right of ESPN, with CLE showing the Cavaliers score and GS showing the Warriors score. The JSON schema should include\n\n{\n  "commentary": str,\n  "win_probability_gs": int [0-100],\n  "current_gs_score": int,\n  "current_cle_score": int,\n  "latency": float\n}',
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
        response_format: { type: "json_object" },
        model: "llama-3.2-11b-vision-preview",
        max_tokens: 150,
        temperature: 0,
      });

      const parsedContent = JSON.parse(
        chatCompletion.choices[0]?.message?.content,
      );
      console.log("Received response from Groq API:", parsedContent);

      const commentary = parsedContent.commentary || "No commentary generated.";
      const winProbability = parsedContent.win_probability_gs ?? 50; // Default fallback
      const warriorsScore = parsedContent.current_gs_score ?? 0; // Default fallback
      const cavaliersScore = parsedContent.current_cle_score ?? 0; // Default fallback
      const latency = chatCompletion.usage?.completion_time || 0; // Default fallback

      // Generate embedding
      const embedding = await generateEmbedding(commentary);
      console.log(
        "Generated embedding:",
        embedding
          ? "Embedding generated successfully"
          : "Failed to generate embedding",
      );

      // Insert data into SingleStore
      const timestamp = new Date();

      if (!commentaryTable) {
        throw new Error("Commentary table is not initialized.");
      }

      await commentaryTable.insert([
        {
          timestamp: timestamp,
          commentary: commentary,
          embedding: JSON.stringify(embedding),
          latency: latency,
          win_probability: winProbability,
          warriors_score: warriorsScore,
          cavaliers_score: cavaliersScore,
        },
      ]);

      return {
        commentary,
        embedding,
        winProbability,
        warriorsScore,
        cavaliersScore,
        latency,
      };
    } catch (error) {
      console.error(
        "Error generating commentary with Groq (Attempt " +
          (retries + 1) +
          "):",
        error,
      );
      retries++;
      if (retries < MAX_RETRIES) {
        console.log("Retrying in " + RETRY_DELAY + "ms...");
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }

  return {
    commentary: "Error generating commentary after " + MAX_RETRIES + " attempts.",
    embedding: null,
    winProbability: null,
    warriorsScore: null,
    cavaliersScore: null,
    latency: null,
  };
}
