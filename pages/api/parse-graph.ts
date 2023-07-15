import fetch from 'node-fetch';
import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import {
  getUserIdByEmail,
  getUserCredits,
  decreaseUserCredits,
} from '../../utils/helper';

import {
  ContextAPI,
  ContextAPIOptionalParams,
  KnownMessageRole,
  Credential,
} from '@contextco/context-node';

const options: ContextAPIOptionalParams = {
  credential: new Credential(process.env.CONTEXT_TOKEN!),
};
const context = new ContextAPI(options);

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
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt, session } = req.body;
  let credits = 0;
  let row_id = null;

  if (session) {
    row_id = await getUserIdByEmail(session.user.email);
    credits = await getUserCredits(row_id);
  }

  const cookies = cookie.parse(req.headers.cookie || '');
  let chartGenerations = cookies.chart_generations
    ? parseInt(cookies.chart_generations, 10)
    : 3; // If chartGenerations cookie doesn't exist, set it to 3

  if (!cookies.chart_generations) {
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('chart_generations', chartGenerations.toString(), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax',
      })
    );
  }

  console.log('Initial chartGenerations:', chartGenerations); // Added for debugging

  if (
    (chartGenerations <= 0 && !session) ||
    (chartGenerations <= 0 && credits <= 0)
  ) {
    res.status(403).json({
      error:
        "You don't have enough credits or chart generations to generate a chart",
    });
    return;
  }

  if (session && credits <= 0) {
    res.status(403).json({
      error: "You don't have enough credits to generate a chart",
    });
    return;
  }

  try {
    // Initialize the Bard
    const API_KEY = process.env.BARD_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${API_KEY}`;
    const outputData = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: { text: prompt } }),
    })
      .then(response => response.json())
      .then((data: any) => {
        if ('candidates' in data) {
          return (data as { candidates: Candidate[] }).candidates[0].output;
        } else {
          throw new Error('Invalid response data');
        }
      });

    if (
      !outputData ||
      outputData.includes('AI-model') ||
      outputData.includes('programmed') ||
      outputData.includes('model') ||
      outputData.includes('AI')
    ) {
      throw new Error('Failed to generate output data');
    }
    if (session) {
      await decreaseUserCredits(row_id);
    } else {
      if (!session && chartGenerations > 0) {
        chartGenerations -= 1;
        console.log('Decreased chartGenerations:', chartGenerations); // Added for debugging
        res.setHeader(
          'Set-Cookie',
          cookie.serialize('chart_generations', chartGenerations.toString(), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: 'lax',
          })
        );
      }
    }
    // Log the conversation using the Context API
    await context.log.conversation({
      body: {
        conversation: {
          messages: [
            { message: prompt, role: KnownMessageRole.User, rating: 0 },
            {
              message: outputData,
              role: KnownMessageRole.Assistant,
              rating: 1,
            },
          ],
        },
      },
    });
    res.status(200).json(outputData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the input' });
  }
}
