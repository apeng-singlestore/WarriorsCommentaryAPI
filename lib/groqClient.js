import Groq from "groq-sdk";
import OpenAI from "openai";
import { GROQ_API_KEY } from "./config";
import { initializeDatabase } from "./singleStoreClient"; // Import the database initialization function

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
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
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
        "Preparing request to Groq API (Attempt " + (retries + 1) + ")"
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
                text: "Describe the scene as if you are an NBA sports commentator commentating on the Warriors vs Cavaliers NBA finals game. ASK viewers ONE QUESTION like 'Will the Warriors make this three-pointer?' or 'Can the defense hold the line?' DO NOT MAKE ANYTHING UP. IF YOU DON'T HAVE INFORMATION, KEEP THE COMMENTARY TO THE CURRENT SCENE. Limit your response to exactly three sentences.",
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

      const commentary =
        chatCompletion.choices[0]?.message?.content ||
        "No commentary generated.";
      console.log("Received response from Groq API:", commentary);

      const embedding = await generateEmbedding(commentary);
      console.log(
        "Generated embedding:",
        embedding
          ? "Embedding generated successfully"
          : "Failed to generate embedding"
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
        },
      ]);

      return {
        commentary,
        embedding,
      };
    } catch (error) {
      console.error(
        "Error generating commentary with Groq (Attempt " +
          (retries + 1) +
          "):",
        error
      );
      retries++;
      if (retries < MAX_RETRIES) {
        console.log("Retrying in " + RETRY_DELAY + "ms...");
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  return {
    commentary:
      "Error generating commentary after " + MAX_RETRIES + " attempts.",
    embedding: null,
  };
}
