// figma-to-tailwind.ts

import { NextApiRequest, NextApiResponse } from "next";
import { convertFigmaToTailwind } from "../utils/converter";
import { FigmaFile } from "..utils/types";
import fetchFigmaData from "../../utils/fetchFigmaData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { figmaLink } = req.body;

  try {
    // Fetch Figma file data
    const designData: FigmaFile = await fetchFigmaData(figmaLink);

    // Convert Figma file to Tailwind
    const tailwindDesign = await convertFigmaToTailwind(designData);

    res.status(200).json({ designData, tailwindDesign });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
}
