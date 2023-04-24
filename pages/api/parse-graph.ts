import { NextApiRequest, NextApiResponse } from "next";

const OPENAI_API_URL = "https://api.openai.com/v1/completions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { prompt } = req.body;
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 100,
        n: 1,
        stop: "\\n",
        model: "text-davinci-002",
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        logprobs: 10,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API request failed");
    }

    const data = await response.json();
    const graphData =
      data.choices && data.choices.length > 0
        ? data.choices[0].text.trim()
        : null;
    if (!graphData) {
      throw new Error("Failed to generate graph data");
    }
    const stringifiedData = graphData.replace(/'/g, '"');
    res.status(200).json(stringifiedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process the input" });
  }
}
