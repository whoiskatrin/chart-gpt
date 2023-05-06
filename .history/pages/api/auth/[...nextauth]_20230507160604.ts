import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from '../../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials');
}

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if the user already exists
      const { data: existingUser, error: existingUserError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (existingUserError) {
        console.error('Error checking for existing user:', existingUserError);
        return false;
      }

      // If the user doesn't exist, save them to the database
      if (!existingUser) {
        const { data, error } = await supabase.from('users').insert([
          {
            id: uuidv4(),
            email: user.email,
            name: user.name,
          },
        ]);

        if (error) {
          console.error('Error saving user:', error);
          return false;
        }
      }

      // If the user exists, you can either update their information or skip the insert operation
      // For example, you can update their name if it has changed:
      else if (existingUser.name !== user.name) {
        const { data, error } = await supabase
          .from('users')
          .update({ name: user.name })
          .eq('id', existingUser.id);

        if (error) {
          console.error('Error updating user name:', error);
          return false;
        }
      }

      return true;
    },
  },
};

export default NextAuth(options);
