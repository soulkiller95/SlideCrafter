import { generateOutlineWithGroq } from "@../../lib/groq";
import { validateOutline } from "@../../lib/validate";

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, slides = 10, topic, linesPerSlide = 10 } = body;

    if (!prompt || prompt.trim().length < 5) {
      return Response.json({ message: "Prompt too short" }, { status: 400 });
    }

    if (slides < 5 || slides > 20) {
      return Response.json(
        { message: "Slides must be between 5 and 20" },
        { status: 400 }
      );
    }

    if (linesPerSlide < 10 || linesPerSlide > 20) {
      return Response.json(
        { message: "Lines per slide must be between 10 and 20" },
        { status: 400 }
      );
    }

    const outline = await generateOutlineWithGroq({
      prompt,
      slides,
      topic,
      linesPerSlide
    });

    validateOutline(outline);

    return Response.json(outline, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}