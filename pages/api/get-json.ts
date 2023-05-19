import { NextApiRequest, NextApiResponse } from "next";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { inputData } = req.body;
    const prompt = `Create a roadmap list from beginner to professional at least in-order 10 maintitles for I wrote within quotation marks. "${inputData}". Provide the list as valid JSON format. Show the main items of the list as property names in the format [{"mainTitle": "", "subheadings": [""]}] Make sure the format use double quotes and property names are string literals. Give JSON result in one line. No \\n or \\t. Provide JSON data only`;

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 2048,
        n: 1,
        model: "gpt-3.5-turbo",
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      }),
    });

    const result = await response.json();
    console.log(result);
    const chartType = result.choices[0].message.content.trim();

    res.status(200).json(chartType);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
