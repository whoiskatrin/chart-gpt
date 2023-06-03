import Bard, { askAI } from 'bard-ai';
import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import {
  getUserIdByEmail,
  getUserCredits,
  decreaseUserCredits,
} from '../../utils/helper';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt, session } = req.body;
  const email = session.user.email;
  // row_id follows SQL naming convention in this case to comply with Supabase Stored Procedures
  const row_id = await getUserIdByEmail(email);
  const credits = await getUserCredits(row_id);

  if (!session) {
    const cookies = cookie.parse(req.headers.cookie || '');

    if (cookies.chart_generations && credits > 0) {
      const chartGenerations = parseInt(cookies.chart_generations, 10);

      if (chartGenerations >= 3) {
        return res.status(403).json({
          error: 'You have reached the limit of 3 free chart generations.',
        });
      } else {
        res.setHeader(
          'Set-Cookie',
          cookie.serialize(
            'chart_generations',
            (chartGenerations + 1).toString(),
            { path: '/' }
          )
        );
      }
    } else {
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('chart_generations', '1', { path: '/' })
      );
    }
  }

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

    if (credits <= 0) {
      return res
        .status(403)
        .json({ error: "You don't have enough credits to generate a chart" });
    }

    // Use askAI function to get the response from Bard AI
    const outputData = await askAI(prompt);
    console.log(outputData);

    if (!outputData) {
      throw new Error('Failed to generate output data');
    }
    if (outputData.includes('AI-model') || outputData.includes('programmed'))
      res.status(500).json({ error: 'Failed to process the input' });
    await decreaseUserCredits(row_id);
    res.status(200).json(outputData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the input' });
  }
}
