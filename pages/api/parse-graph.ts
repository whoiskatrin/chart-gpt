import Bard, { askAI } from 'bard-ai';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt } = req.body;
  console.log('Prompt: ' + prompt);

  try {
    // Initialize the Bard with the cookie key
    const BARD_KEY = process.env.BARD_KEY;
    if (typeof BARD_KEY === 'undefined') {
      // Handle the error, for example by logging it and exiting
      console.error('BARD_KEY is not set');
      process.exit(1);
    } else {
      await Bard.init(BARD_KEY);
    }

    // Use askAI function to get the response from Bard AI
    const outputData = await askAI(prompt);
    console.log(outputData);

    if (!outputData) {
      throw new Error('Failed to generate output data');
    }
    if (outputData.includes('AI-model') || outputData.includes('programmed'))
      res.status(500).json({ error: 'Failed to process the input' });
    res.status(200).json(outputData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the input' });
  }
}
