import { SingleStoreClient } from "@singlestore/client";

const client = new SingleStoreClient();

const workspace = client.workspace({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT, 10),
});

const database = workspace.database(process.env.PGDATABASE);

async function initializeCommentaryTable() {
  try {
    const commentaryTable = await database.createTable({
      name: "commentary_data",
      columns: {
        id: { type: "BIGINT", autoIncrement: true, primaryKey: true },
        timestamp: { type: "DATETIME" },
        commentary: { type: "TEXT" },
        embedding: { type: "JSON" },
        video_timestamp: { type: "FLOAT" },
      },
    });
    console.log("Commentary table created successfully");
    return commentaryTable;
  } catch (error) {
    if (error.message.includes("Table 'commentary_data' already exists")) {
      console.log("Commentary table already exists, using existing table");
      return database.table("commentary_data");
    } else {
      console.error("Error creating commentary table:", error);
      throw error;
    }
  }
}

const commentaryTable = await initializeCommentaryTable();

export { commentaryTable };
