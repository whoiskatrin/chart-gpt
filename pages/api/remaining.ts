import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { supabase } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user is logged in
  const session = await getSession({ req });
  console.log('Session:', session);

  if (!session || !session.user) {
    console.log('User not logged in');
    return res.status(401).json('Please, login.');
  }

  // Query the database by email to get the number of generations left
  const { data: user, error } = await supabase
    .from('users')
    .select('id, credits')
    .eq('email', session.user.email)
    .single();

  if (error) {
    console.error('Error fetching user:', error.message);
    return res.status(500).json('Error fetching user data.');
  }

  return res.status(200).json({ remainingGenerations: user?.credits });
}
