import Groq from "groq-sdk";

export async function generateOutlineWithGroq({
  prompt,
  slides,
  topic,
  linesPerSlide
}) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY in .env.local");

  const groq = new Groq({ apiKey });

  const systemPrompt = `
You are an expert PowerPoint presentation creator.

Return ONLY valid JSON, no markdown, no extra text.

JSON format:
{
  "title": "Presentation Title",
  "subtitle": "Short subtitle",
  "slides": [
    {
      "title": "Slide title",
      "bullets": ["point 1", "point 2", "..."],
      "speakerNotes": "short notes"
    }
  ]
}

Rules:
- Generate exactly ${slides} slides
- Each slide MUST be detailed
- Each slide MUST have ${linesPerSlide} bullet points (exactly)
- Each bullet point should be 8-14 words
- Keep language simple for students
- No emojis
- Include examples wherever possible
- Avoid repeating the same bullet points across slides
`;

  const userPrompt = `
Topic: ${topic || "Not provided"}
User Prompt: ${prompt}

Make it detailed and professional.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.35,
    messages: [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: userPrompt.trim() }
    ],
    response_format: { type: "json_object" }
  });

  const text = completion.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq returned empty response");

  return JSON.parse(text);
}