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
    const prompt = `The following are the possible chart types supported by the code provided: area, bar, line, composed, scatter, pie, radar, radialBar, treemap, and funnel. Given the user input: ${inputData}, identify the chart type the user wants to display. Return just one word
`;

    // Initialize the Bard
    const API_KEY = process.env.BARD_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${API_KEY}`;
    const chartType = await fetch(url, {
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

    if (
      !chartType ||
      chartType.includes('AI-model') ||
      chartType.includes('programmed') ||
      chartType.includes('model') ||
      chartType.includes('AI')
    ) {
      throw new Error('Failed to generate output data');
    }

    res.status(200).json(chartType);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
