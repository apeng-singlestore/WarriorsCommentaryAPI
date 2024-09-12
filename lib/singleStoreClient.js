import { SingleStoreClient } from "@singlestore/client";

const client = new SingleStoreClient();

const workspace = client.workspace({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

const database = workspace.database(process.env.DATABASE_NAME);

// Create the table if it doesn't exist
async function createTableIfNotExists() {
  await database.query(`
    CREATE TABLE IF NOT EXISTS commentary_data (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      timestamp DATETIME,
      commentary TEXT,
      embedding JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Insert data into the table
async function insertCommentaryData(timestamp, commentary, embedding) {
  await database.query(`
    INSERT INTO commentary_data (timestamp, commentary, embedding)
    VALUES (?, ?, ?);
  `, [timestamp, commentary, JSON.stringify(embedding)]);
}

export { createTableIfNotExists, insertCommentaryData };
