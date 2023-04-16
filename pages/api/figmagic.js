import { exec } from "child_process";
import { promisify } from "util";
import { createClient } from "@supabase/supabase-js";
import extractFigmaFileId from "../../utils/helper";

const execAsync = promisify(exec);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

async function generateFigmagicFiles(figmaLink) {
  const fileId = extractFigmaFileId(figmaLink);

  const { stdout, stderr } = await execAsync(
    `npx figmagic --token ${process.env.FIGMA_TOKEN} --url ${fileId} -file - -base -elements -graphics -tokens`,
    { encoding: "buffer" }
  );

  if (stderr) {
    console.error(stderr.toString());
    throw new Error("Failed to generate figmagic files");
  }

  // Upload each file to Supabase Storage
  await Promise.all([
    uploadFileToStorage(stdout, "css.css"),
    uploadFileToStorage(stdout, "tokens.ts"),
    uploadFileToStorage(stdout, "elements.tsx"),
    uploadFileToStorage(stdout, "graphics.tsx"),
    uploadFileToStorage(stdout, "storybook.js"),
    uploadFileToStorage(stdout, "description.md"),
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

async function uploadFileToStorage(fileContent, filename) {
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
      cssUrl: figmagicFiles.cssUrl,
      tokensUrl: figmagicFiles.tokensUrl,
      elementsUrl: figmagicFiles.elementsUrl,
      graphicsUrl: figmagicFiles.graphicsUrl,
      storybookUrl: figmagicFiles.storybookUrl,
      descriptionUrl: figmagicFiles.descriptionUrl,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
