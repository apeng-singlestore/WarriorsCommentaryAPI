import { SingleStoreClient } from "@singlestore/client";

// Initialize SingleStore Client
const client = new SingleStoreClient();

// Function to initialize the database and create the table
export async function initializeDatabase() {
  try {
    // Connect to the workspace
    const workspace = client.workspace({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
    });

    // Connect to the database
    const database = workspace.database(process.env.DATABASE_NAME);

    // Check if the commentary table exists and create it if it doesn't
    const commentaryTable = await database.createTable({
      name: "commentary_data",
      columns: {
        timestamp: { type: "DATETIME" },
        commentary: { type: "TEXT" },
        embedding: { type: "JSON" },
      },
    });

    console.log("Table created successfully:", commentaryTable);
    return commentaryTable;
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  }
}
