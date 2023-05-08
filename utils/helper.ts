import { supabase } from '../lib/supabase';

export async function getUserIdByEmail(email: any) {
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

export async function decreaseUserCredits(row_id: any) {
  const { data, error } = await supabase.rpc('decrease_credits', {
    row_id,
  });

  if (error) {
    throw new Error('Error updating user credits');
  }

  return data;
}

export async function addUserCredits(row_id: any, credits: any) {
  const { data, error } = await supabase.rpc('add_credits', {
    row_id,
    credits,
  });

  if (error) {
    throw new Error('Error updating user credits');
  }

  return data;
}

export async function getUserCredits(row_id: any) {
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
