import { NextApiRequest, NextApiResponse } from 'next';

const OPENAI_API_URL = 'https://api.openai.withlogging.com/v1/completions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { inputData, chart } = req.body;
    const prompt = `Based on ${inputData} generate a valid JSON in which each element is an object for Recharts API for chart ${chart} without new line characters '\n'. Strictly using this FORMAT and naming:
[{ "name": "a", "value": 12 }]. Make sure field name always stays named name. Instead of naming value field value in JSON, name it based on user metric and make it the same across every item.\n Make sure the format use double quotes and property names are string literals. Provide JSON data only. `;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'X-Api-Key': `Bearer ${process.env.REPORT_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        temperature: 0.8,
        max_tokens: 248,
        n: 1,
        stop: '\\n',
        model: 'text-davinci-003',
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        logprobs: 10,
      }),
    });

    const result = await response.json();
    console.log(result);
    const chartType = result.choices[0].text.trim();

    res.status(200).send(chartType);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
