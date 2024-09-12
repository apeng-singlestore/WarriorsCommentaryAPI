import { SingleStoreClient } from "@singlestore/client";

const client = new SingleStoreClient();

const workspace = client.workspace({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

const database = workspace.database(process.env.DATABASE_NAME);

const commentaryTable = await database.createTable({
  name: "commentary_data",
  columns: {
    timestamp: { type: "DATETIME" },
    commentary: { type: "TEXT" },
    embedding: { type: "JSON" },
  },
});

// Insert data into the table
async function insertCommentaryData(timestamp, commentary, embedding) {
  await commentaryTable.insert([
    {
      timestamp: timestamp,
      commentary: commentary,
      embedding: JSON.stringify(embedding),
    },
  ]);
}

export { insertCommentaryData };
