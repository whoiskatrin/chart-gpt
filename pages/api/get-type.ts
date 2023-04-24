import { NextApiRequest, NextApiResponse } from "next";

const OPENAI_API_URL = "https://api.openai.com/v1/completions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { inputData } = req.body;
    const prompt = `The following are the possible chart types supported by the code provided: area, bar, line, composed, scatter, pie, radar, radialBar, treemap, and funnel. Given the user input: ${inputData}, identify the chart type the user wants to display. Return just one word
`;

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 20,
        n: 1,
        stop: "\\n",
        model: "text-davinci-002",
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        logprobs: 10,
      }),
    });

    const result = await response.json();
    const chartType = result.choices[0].text.trim();

    res.status(200).json(chartType);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
