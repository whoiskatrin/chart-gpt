function extractFigmaFileId(figmaUrl: string) {
  const regex = /file\/([a-zA-Z0-9]+)\//;
  const match = figmaUrl.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  throw new Error("Invalid Figma URL");
}

export default extractFigmaFileId;
