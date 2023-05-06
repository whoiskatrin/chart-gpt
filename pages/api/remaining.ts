import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { supabase } from '../../pages/_app';
import requestIp from 'request-ip';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user is logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    console.log('User not logged in');
    return res.status(401).json('Login to upload.');
  }

  // Query the database by email to get the number of generations left
  const { data: user, error } = await supabase
    .from('user_credits')
    .select('user_id')
    .single();

  if (error) {
    console.error('Error fetching user:', error.message);
    return res.status(500).json('Error fetching user data.');
  }

  if (!user?.location) {
    const ip = requestIp.getClientIp(req);
    const locationResponse = await fetch(
      `http://api.ipstack.com/${ip}?access_key=${process.env.IPSTACK_API_KEY}`
    );
    const location = await locationResponse.json();

    const { error: updateError } = await supabase
      .from('users')
      .update({ location: location.country_code })
      .eq('email', session.user.email);

    if (updateError) {
      console.error('Error updating user location:', updateError.message);
      return res.status(500).json('Error updating user location.');
    }
  }

  return res.status(200).json({ remainingGenerations: user?.credits });
}
