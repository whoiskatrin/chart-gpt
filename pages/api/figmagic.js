import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const execAsync = promisify(exec);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

async function generateFigmagicFiles(figmaLink) {
  const outputDir = "/tmp";

  await execAsync(
    `npx figmagic start --url ${figmaLink} --token ${process.env.FIGMA_TOKEN} --output ${outputDir}`
  );

  // Upload each file to Supabase Storage
  await Promise.all([
    uploadFileToStorage(`${outputDir}/css.css`, "css.css"),
    uploadFileToStorage(`${outputDir}/tokens.ts`, "tokens.ts"),
    uploadFileToStorage(`${outputDir}/elements.tsx`, "elements.tsx"),
    uploadFileToStorage(`${outputDir}/graphics.tsx`, "graphics.tsx"),
    uploadFileToStorage(`${outputDir}/storybook.js`, "storybook.js"),
    uploadFileToStorage(`${outputDir}/description.md`, "description.md"),
  ]);

  // Return the URLs for each uploaded file
  const baseStorageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/${process.env.SUPABASE_BUCKET_NAME}`;
  return {
    cssUrl: `${baseStorageUrl}/css.css`,
    tokensUrl: `${baseStorageUrl}/tokens.ts`,
    elementsUrl: `${baseStorageUrl}/elements.tsx`,
    graphicsUrl: `${baseStorageUrl}/graphics.tsx`,
    storybookUrl: `${baseStorageUrl}/storybook.js`,
    descriptionUrl: `${baseStorageUrl}/description.md`,
  };
}

async function uploadFileToStorage(filePath, filename) {
  const fileContent = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME)
    .upload(filename, fileContent);

  if (error) {
    throw new Error(error.message);
  }
}

export default async function handler(req, res) {
  const { figmaLink } = req.body;

  try {
    const figmagicFiles = await generateFigmagicFiles(figmaLink);
    console.log(figmagicFiles);
    res.status(200).send({
      cssUrl: `${baseS3Url}/css.css`,
      tokensUrl: `${baseS3Url}/tokens.ts`,
      elementsUrl: `${baseS3Url}/elements.tsx`,
      graphicsUrl: `${baseS3Url}/graphics.tsx`,
      storybookUrl: `${baseS3Url}/storybook.js`,
      descriptionUrl: `${baseS3Url}/description.md`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
