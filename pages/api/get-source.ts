import { NextApiRequest, NextApiResponse } from 'next';

const OPENAI_API_URL = 'https://api.openai.withlogging.com/v1/chat/completions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { inputData } = req.body;
    const prompt = `Find the data source in this text ${inputData} and extract it. Don't add any additional word except Data Source: in front of the result, just list a full source name or all of them if there are a few.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'X-Api-Key': `Bearer ${process.env.REPORT_KEY}`,
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 10,
        n: 1,
        model: 'gpt-3.5-turbo',
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      }),
    });

    const data = await response.json();

    const source = data.choices[0].message.content.trim();
    console.log('SOURCE:' + data.data);

    res.status(200).send(source);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
