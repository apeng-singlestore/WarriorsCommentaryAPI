import { processFrame } from '../../lib/frameProcessor';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { imageData, width, height } = req.body;
    try {
      const result = await processFrame(imageData, width, height);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error processing frame:', error);
      res.status(500).json({ error: 'Error processing frame' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
