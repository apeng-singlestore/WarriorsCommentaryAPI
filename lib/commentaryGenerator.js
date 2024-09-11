const commentaryTemplates = [
  "Curry with a long-range three!",
  "Thompson finds an open lane for an easy layup.",
  "Green with an impressive defensive stop!",
  "Warriors showing great ball movement.",
  "Incredible fast break by the Warriors!",
];

export function generateCommentary() {
  const randomIndex = Math.floor(Math.random() * commentaryTemplates.length);
  return {
    timestamp: new Date().toISOString(),
    text: commentaryTemplates[randomIndex],
  };
}
