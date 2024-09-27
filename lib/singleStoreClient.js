import { AI } from "@singlestore/ai";
import { SingleStoreClient } from "@singlestore/client";

const ai = new AI({ openAIApiKey: process.env.OPENAI_API_KEY });
const client = new SingleStoreClient({ ai });

// Function to initialize the database and create the table
export async function initializeDatabase() {
  try {
    // Connect to the workspace
    const connection = client.workspace({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    });

    // Connect to the database
    const database = connection.database(process.env.DATABASE_NAME);

    const commentaryTable = await database.createTable({
      name: "commentary_data",
      columns: {
        timestamp: { type: "DATETIME", nullable: false },
        commentary: { type: "TEXT", nullable: false },
        embedding: { type: "vector(1536)", nullable: true },
        latency: { type: "FLOAT", nullable: true },
        win_probability: { type: "FLOAT", nullable: true },
        warriors_score: { type: "FLOAT", nullable: true },
        cavaliers_score: { type: "FLOAT", nullable: true },
      },
    });

    console.log("Table created or already exists:", commentaryTable);
    return commentaryTable;
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  }
}

// Function to perform raw queries on the SingleStore database
export async function query(sql, values = []) {
  try {
    const workspace = client.workspace({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
    });

    const database = workspace.database(process.env.DATABASE_NAME);
    const [results] = await database.query(sql, values);
    return results;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}
