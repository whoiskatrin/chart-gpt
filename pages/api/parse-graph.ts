import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function fetchOpenAIData(prompt: any) {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 1000,
      n: 1,
      model: 'gpt-3.5-turbo',
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }

  return await response.json();
}

async function getUserCredits(row_id: any) {
  const { data, error } = await supabase
    .from('users')
    .select('credits')
    .eq('id', row_id)
    .single();

  if (error) {
    throw new Error('Error fetching user credits');
  }

  return data.credits;
}

async function getUserIdByEmail(email: any) {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (error) {
    throw new Error('Error fetching user ID');
  }

  return data.id;
}

async function decreaseUserCredits(row_id: any) {
  const { data, error } = await supabase.rpc('decrease_credits', {
    row_id,
  });

  if (error) {
    throw new Error('Error updating user credits');
  }

  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, prompt } = req.body;

  try {
    const row_id = await getUserIdByEmail(email);
    const credits = await getUserCredits(row_id);
    console.log('credits: ' + credits);

    if (credits <= 0) {
      return res
        .status(403)
        .json({ error: "You don't have enough credits to generate a chart" });
    }

    const jsonData = await fetchOpenAIData(prompt);
    const graphData =
      jsonData.choices && jsonData.choices.length > 0
        ? jsonData.choices[0].message.content.trim()
        : null;

    if (!graphData) {
      throw new Error('Failed to generate graph data');
    }

    const stringifiedData = graphData.replace(/'/g, '"');

    await decreaseUserCredits(row_id);

    return res.status(200).json(stringifiedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to process the input' });
  }
}
