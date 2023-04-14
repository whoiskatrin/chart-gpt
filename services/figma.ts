// services/figma.ts
import axios, { AxiosInstance } from "axios";

interface FigmaImageData {
  err?: string;
  images: Record<string, string>;
}

const FigmaApi: AxiosInstance = axios.create({
  baseURL: "https://api.figma.com/v1",
  headers: {
    "X-Figma-Token": process.env.NEXT_PUBLIC_FIGMA_API_KEY,
  },
});

export async function getFigmaFile(fileId: string) {
  try {
    const response = await FigmaApi.get(`/files/${fileId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Figma file:", error);
    return null;
  }
}

export async function getImageURLs(fileId: string, nodeIds: string[]) {
  try {
    const response = await FigmaApi.get<FigmaImageData>(`/images/${fileId}`, {
      params: {
        ids: nodeIds.join(","),
        format: "png",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Figma image URLs:", error);
    return null;
  }
}
