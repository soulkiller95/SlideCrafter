import "./globals.css";

export const metadata = {
  title: "AI PPT Generator",
  description: "Generate PowerPoint from prompt using Gemini + PptxGenJS"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}