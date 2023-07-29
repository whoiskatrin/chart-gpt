import { NextApiRequest, NextApiResponse } from 'next';

interface Candidate {
  output: string;
  safetyRatings: Array<{ category: string; probability: string }>;
}

interface ResponseData {
  candidates: Candidate[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { inputData } = req.body;
    const prompt = `Given the following text "${inputData}", identify and extract the data source. Follow the format "Data source: {data source}". Please provide the source name and do not add any additional words, keep it short.`;

    const API_KEY = process.env.BARD_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${API_KEY}`;
    const source = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: { text: prompt } }),
    })
      .then(response => response.json())
      .then((data: any) => {
        console.log(data); // <-- This will print the API response
        if ('candidates' in data) {
          return (data as { candidates: Candidate[] }).candidates[0].output;
        } else {
          throw new Error('Invalid response data');
        }
      });

    res.status(200).send(source);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
