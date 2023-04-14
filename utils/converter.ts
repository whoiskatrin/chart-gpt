import { FigmaDocument } from "./types";
import fetch from "node-fetch";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL =
  "https://api.openai.com/v1/engines/davinci-codex/completions";

interface OpenAIResponse {
  choices: { text: string }[];
}

const generateTailwindClasses = async (input: string) => {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: `Convert the following Figma styles to Tailwind CSS classes:\n\n${input}\n\nTailwind CSS classes:`,
      max_tokens: 50,
      n: 1,
      stop: null,
      temperature: 0.5,
    }),
  });

  const data: OpenAIResponse = await response.json();
  const choice = data.choices[0];
  return choice.text.trim();
};

export const convertFigmaToTailwind = async (figmaDocument: FigmaDocument) => {
  const output: any[] = [];

  for (const child of figmaDocument.children) {
    if (child.type === "TEXT") {
      const style = child.style;

      // Basic text style conversion
      const input = `Font size: ${style.fontSize}px, Font weight: ${
        style.fontWeight
      }, Line height: ${style.lineHeightPx}px, Letter spacing: ${
        style.letterSpacing
      }px, Color: rgba(${Math.round(
        child.fills[0].color.r * 255
      )}, ${Math.round(child.fills[0].color.g * 255)}, ${Math.round(
        child.fills[0].color.b * 255
      )}, ${child.fills[0].color.a})`;

      const tailwindClasses = await generateTailwindClasses(input);

      output.push({
        type: "text",
        content: child.characters,
        tailwindClasses: tailwindClasses,
      });
    }
    // Add more element types and their respective conversions
  }

  return output;
};

export default convertFigmaToTailwind;
