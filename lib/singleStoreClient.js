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
    const commentaryTable = await database.table.create({
      name: "commentary_data",
      columns: {
        id: {
          type: "BIGINT",
          autoIncrement: true,
          primaryKey: true,
          nullable: false,
        },
        timestamp: { type: "DATETIME", nullable: false },
        commentary: { type: "TEXT", nullable: false },
        embedding: { type: "JSON", nullable: true },
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
