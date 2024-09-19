import ElevenLabs from "elevenlabs-node";

const voice = new ElevenLabs({
  apiKey: process.env.ELEVENLABS_API_KEY,
  voiceId: "pNInz6obpgDQGcFmaJgB",
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { text } = req.body;

    try {
      // Stream the audio from ElevenLabs API
      const audioStream = await voice.textToSpeechStream({
        textInput: text,
      });

      // Return the audio stream in the response
      res.setHeader("Content-Type", "audio/mpeg");
      audioStream.pipe(res);
    } catch (error) {
      console.error("Error generating speech:", error);
      res.status(500).json({ error: "Failed to generate speech." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
