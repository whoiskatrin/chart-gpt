import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { getUserCredits } from '../../utils/helper';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  if (!userId) {
    console.log('User not logged in');
    return res.status(401).json({ error: 'Please, login.' });
  }

  try {
    const credits = await getUserCredits(userId);
    return res.status(200).json({ remainingGenerations: credits });
  } catch (error: any) {
    console.error('Error fetching user:', error.message);
    return res.status(500).json({ error: 'Error fetching user data.' });
  }
}
