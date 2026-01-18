import { validateOutline } from "@../../lib/validate";
import { buildPptx } from "@../../lib/pptx";

export async function POST(req) {
  try {
    const body = await req.json();
    const { outline, theme = "dark" } = body;

    if (!outline) {
      return Response.json({ message: "Missing outline" }, { status: 400 });
    }

    validateOutline(outline);

    const pptxBuffer = await buildPptx(outline, theme);

    return new Response(pptxBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="presentation.pptx"`
      }
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}