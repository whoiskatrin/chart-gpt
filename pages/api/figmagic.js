import * as execa from "execa";

async function generateTailwindClasses(figmaLink) {
  const { stdout } = await execa("figmagic", [
    "start",
    "--url",
    figmaLink,
    "--token",
    process.env.FIGMA_TOKEN,
    "--format",
    "tailwind",
  ]);

  return JSON.parse(stdout);
}

export default async function handler(req, res) {
  const { figmaLink } = req.body;

  try {
    const tailwindClasses = await generateTailwindClasses(figmaLink);
    console.log(tailwindClasses);
    res.status(200).json(tailwindClasses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
