import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

async function generateFigmagicFiles(figmaLink) {
  // Create output directory if it does not exist
  const outputDir = path.join(process.cwd(), ".figmagic", "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await execAsync(
    `figmagic start --url ${figmaLink} --token ${process.env.FIGMA_TOKEN} --output ${outputDir}`
  );

  // Read the contents of each generated file
  const cssContent = fs.readFileSync(path.join(outputDir, "css.css"), "utf-8");
  const tokensContent = fs.readFileSync(
    path.join(outputDir, "tokens.ts"),
    "utf-8"
  );
  const elementsContent = fs.readFileSync(
    path.join(outputDir, "elements.tsx"),
    "utf-8"
  );
  const graphicsContent = fs.readFileSync(
    path.join(outputDir, "graphics.tsx"),
    "utf-8"
  );
  const storybookContent = fs.readFileSync(
    path.join(outputDir, "storybook.js"),
    "utf-8"
  );
  const descriptionContent = fs.readFileSync(
    path.join(outputDir, "description.md"),
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
