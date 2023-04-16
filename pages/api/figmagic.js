import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import AWS from "aws-sdk";

const execAsync = promisify(exec);

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function generateFigmagicFiles(figmaLink) {
  const outputDir = "/tmp/figmagic-output";

  await execAsync(
    `figmagic start --url ${figmaLink} --token ${process.env.FIGMA_TOKEN} --output ${outputDir}`
  );

  // Read the contents of each generated file
  const cssContent = fs.readFileSync(`${outputDir}/css.css`, "utf-8");
  const tokensContent = fs.readFileSync(`${outputDir}/tokens.ts`, "utf-8");
  const elementsContent = fs.readFileSync(`${outputDir}/elements.tsx`, "utf-8");
  const graphicsContent = fs.readFileSync(`${outputDir}/graphics.tsx`, "utf-8");
  const storybookContent = fs.readFileSync(
    `${outputDir}/storybook.js`,
    "utf-8"
  );
  const descriptionContent = fs.readFileSync(
    `${outputDir}/description.md`,
    "utf-8"
  );

  // Upload each file to S3
  await Promise.all([
    uploadFileToS3(cssContent, "css.css"),
    uploadFileToS3(tokensContent, "tokens.ts"),
    uploadFileToS3(elementsContent, "elements.tsx"),
    uploadFileToS3(graphicsContent, "graphics.tsx"),
    uploadFileToS3(storybookContent, "storybook.js"),
    uploadFileToS3(descriptionContent, "description.md"),
  ]);

  // Return the URLs for each uploaded file
  const baseS3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com`;
  return {
    cssUrl: `${baseS3Url}/css.css`,
    tokensUrl: `${baseS3Url}/tokens.ts`,
    elementsUrl: `${baseS3Url}/elements.tsx`,
    graphicsUrl: `${baseS3Url}/graphics.tsx`,
    storybookUrl: `${baseS3Url}/storybook.js`,
    descriptionUrl: `${baseS3Url}/description.md`,
  };
}

async function uploadFileToS3(fileContent, filename) {
  return s3
    .upload({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      Body: fileContent,
      ACL: "public-read",
      ContentType: getContentType(filename),
    })
    .promise();
}

function getContentType(filename) {
  const extension = filename.split(".").pop().toLowerCase();
  switch (extension) {
    case "css":
      return "text/css";
    case "ts":
      return "text/plain";
    case "tsx":
      return "text/plain";
    case "js":
      return "application/javascript";
    case "md":
      return "text/markdown";
    default:
      return "application/octet-stream";
  }
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
