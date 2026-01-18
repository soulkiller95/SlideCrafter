export function validateOutline(outline) {
  if (!outline?.title || !Array.isArray(outline.slides)) {
    throw new Error("Invalid AI outline format.");
  }

  outline.slides.forEach((s, idx) => {
    if (!s.title || !Array.isArray(s.bullets)) {
      throw new Error(`Invalid slide format at slide ${idx + 1}`);
    }
    if (s.bullets.length < 2) {
      throw new Error(`Slide ${idx + 1} has too few bullet points.`);
    }
  });

  return true;
}