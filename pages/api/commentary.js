import { generateCommentary } from '../../lib/commentaryGenerator';

export default function handler(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const sendCommentary = () => {
    const commentary = generateCommentary();
    res.write(`data: ${JSON.stringify(commentary)}\n\n`);
  };

  // Send initial commentary
  sendCommentary();

  // Send commentary every 5 seconds
  const intervalId = setInterval(sendCommentary, 5000);

  // Clean up on close
  res.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
}
