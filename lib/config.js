export const GROQ_API_KEY = process.env.GROQ_API_KEY;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log("GROQ_API_KEY in config:", GROQ_API_KEY ? "Set" : "Not set");
console.log("OPENAI_API_KEY in config:", OPENAI_API_KEY ? "Set" : "Not set");
