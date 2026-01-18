import PptxGenJS from "pptxgenjs";

function getTheme(theme) {
  const themes = {
    light: { bg: "FFFFFF", text: "111111", accent: "2563EB" },
    corporate: { bg: "F6F7FB", text: "111827", accent: "0F766E" },
    neon: { bg: "000000", text: "00FFCC", accent: "FF00FF" },
    ocean: { bg: "0F172A", text: "E2E8F0", accent: "38BDF8" },
    sunset: { bg: "4C1D11", text: "FFF7ED", accent: "FB923C" },
    forest: { bg: "1A2F1A", text: "F0FDF4", accent: "4ADE80" },
    minimal: { bg: "FFFFFF", text: "000000", accent: "000000" },
    dark: { bg: "0B0B10", text: "FFFFFF", accent: "5B5BFF" }
  };

  return themes[theme] || themes.dark;
}

export async function buildPptx(outline, theme = "dark") {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";

  const t = getTheme(theme);

  // --- Title Slide
  {
    const slide = pptx.addSlide();
    slide.background = { color: t.bg };

    slide.addText(outline.title, {
      x: 0.7,
      y: 1.6,
      w: 12,
      h: 0.8,
      fontSize: 44,
      bold: true,
      color: t.text
    });

    slide.addText(outline.subtitle || "Generated using AI", {
      x: 0.7,
      y: 2.5,
      w: 12,
      h: 0.5,
      fontSize: 18,
      color: t.accent
    });

    slide.addShape(pptx.ShapeType.rect, {
      x: 0.7,
      y: 3.2,
      w: 12.0,
      h: 0.05,
      fill: { color: t.accent }
    });
  }

  // --- Content slides
  outline.slides.forEach((s) => {
    const slide = pptx.addSlide();
    slide.background = { color: t.bg };

    // title bar
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.7,
      y: 0.4,
      w: 12.0,
      h: 0.7,
      fill: { color: t.accent },
      line: { color: t.accent }
    });

    slide.addText(s.title, {
      x: 0.9,
      y: 0.55,
      w: 11.6,
      h: 0.5,
      fontSize: 22,
      bold: true,
      color: "FFFFFF"
    });

    const bulletText = s.bullets.map((b) => `• ${b}`).join("\n");

    slide.addText(bulletText, {
      x: 1.0,
      y: 1.4,
      w: 12,
      h: 4.7,
      fontSize: 20,
      color: t.text,
      valign: "top"
    });

    if (s.speakerNotes) {
      slide.addNotes(s.speakerNotes);
    }

    // footer
    slide.addText("AI PPT Generator", {
      x: 0.7,
      y: 6.9,
      w: 6,
      h: 0.3,
      fontSize: 10,
      color: "888888"
    });
  });

  const buffer = await pptx.write("nodebuffer");
  return buffer;
}