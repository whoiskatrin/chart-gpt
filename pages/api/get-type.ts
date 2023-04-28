import { NextApiRequest, NextApiResponse } from "next";
import { OPENAI_API_URL } from "../../constants";

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
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 10,
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
