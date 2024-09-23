import { Configuration, OpenAIApi } from "openai";
import { query } from "../../lib/singleStoreClient";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { question } = req.body;

      // Fetch data from SingleStore
      const data = await query(`
        SELECT timestamp, commentary
        FROM commentary_data
        ORDER BY timestamp DESC
        LIMIT 50
      `);

      // Generate graph data using GPT-4
      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a data visualization expert. Given a question and some data, generate a Recharts graph configuration in JSON format."
          },
          {
            role: "user",
            content: `Question: ${question}

Data: ${JSON.stringify(data)}

Generate a Recharts graph configuration that answers this question using the provided data. The configuration should include the graph type, data format, and axis configurations.`
          }
        ],
      });

      const graphConfig = JSON.parse(completion.data.choices[0].message.content);

      res.status(200).json(graphConfig);
    } catch (error) {
      console.error('Error generating graph:', error);
      res.status(500).json({ error: 'Error generating graph' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
