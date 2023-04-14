import type { NextApiRequest, NextApiResponse } from "next";
import { getFigmaFile } from "../../services/figma";

async function fetchFigmaDesign(figmaLink: string) {
  const fileId = figmaLink.split("/file/")[1].split("/")[0];

  const figmaFile = await getFigmaFile(fileId);

  return figmaFile;
}

function convertToTailwind(figmaDesign: any) {
  return "Your converted Tailwind CSS code here...";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { figmaLink } = req.body;
      const designData = await fetchFigmaDesign(figmaLink);
      const tailwindDesign = convertToTailwind(designData);

      res.status(200).json({ designData, tailwindDesign });
    } catch (error) {
      console.error("Error converting Figma design to Tailwind CSS:", error);
      res
        .status(500)
        .json({ message: "Error converting Figma design to Tailwind CSS" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
