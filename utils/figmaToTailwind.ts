// utils/figmaToTailwind.ts
import { Node } from "figma-js";
import { generateTailwindCSS } from "./openAI";

interface TailwindNode {
  type: string;
  css: string;
  children?: TailwindNode[];
}

export async function convertFigmaToTailwind(
  node: Node
): Promise<TailwindNode> {
  const generatedCSS = await generateTailwindCSS(node);

  return {
    type: node.type === "TEXT" ? "p" : "div",
    css: generatedCSS,
  };
}
