import { exec } from "child_process";
import { promisify } from "util";
import AWS from "aws-sdk";

const execAsync = promisify(exec);

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function generateFigmagicFiles(figmaLink) {
  const outputDir = "/tmp";

  await execAsync(
    `npx figmagic start --url ${figmaLink} --token ${process.env.FIGMA_TOKEN} --output ${outputDir}`
  );

  // Upload each file to S3
  const baseS3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com`;
  await Promise.all([
    uploadFileToS3(`${outputDir}/css.css`, "css.css"),
    uploadFileToS3(`${outputDir}/tokens.ts`, "tokens.ts"),
    uploadFileToS3(`${outputDir}/elements.tsx`, "elements.tsx"),
    uploadFileToS3(`${outputDir}/graphics.tsx`, "graphics.tsx"),
    uploadFileToS3(`${outputDir}/storybook.js`, "storybook.js"),
    uploadFileToS3(`${outputDir}/description.md`, "description.md"),
  ]);

  // Return the URLs for each uploaded file
  return {
    cssUrl: `${baseS3Url}/css.css`,
    tokensUrl: `${baseS3Url}/tokens.ts`,
    elementsUrl: `${baseS3Url}/elements.tsx`,
    graphicsUrl: `${baseS3Url}/graphics.tsx`,
    storybookUrl: `${baseS3Url}/storybook.js`,
    descriptionUrl: `${baseS3Url}/description.md`,
  };
}

async function uploadFileToS3(filePath, filename) {
  const fileContent = await fs.promises.readFile(filePath);
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
