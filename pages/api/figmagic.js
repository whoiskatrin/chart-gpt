import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";

const execAsync = promisify(exec);

async function generateFigmagicFiles(figmaLink) {
  await execAsync(
    `figmagic start --url ${figmaLink} --token ${process.env.FIGMA_TOKEN}`
  );

  // Read the contents of each generated file
  const cssContent = fs.readFileSync("./.figmagic/output/css.css", "utf-8");
  const tokensContent = fs.readFileSync(
    "./.figmagic/output/tokens.ts",
    "utf-8"
  );
  const elementsContent = fs.readFileSync(
    "./.figmagic/output/elements.tsx",
    "utf-8"
  );
  const graphicsContent = fs.readFileSync(
    "./.figmagic/output/graphics.tsx",
    "utf-8"
  );
  const storybookContent = fs.readFileSync(
    "./.figmagic/output/storybook.js",
    "utf-8"
  );
  const descriptionContent = fs.readFileSync(
    "./.figmagic/output/description.md",
    "utf-8"
  );

  // Return an object with the contents of each file
  return {
    css: cssContent,
    tokens: tokensContent,
    elements: elementsContent,
    graphics: graphicsContent,
    storybook: storybookContent,
    description: descriptionContent,
  };
}

export default async function handler(req, res) {
  const { figmaLink } = req.body;

  try {
    const figmagicFiles = await generateFigmagicFiles(figmaLink);
    console.log(figmagicFiles);
    res.status(200).json(figmagicFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
