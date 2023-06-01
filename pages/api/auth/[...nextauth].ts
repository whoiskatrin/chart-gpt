import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../../lib/supabase';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials');
}

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Check if the user already exists
      const { data: existingUser, error: existingUserError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .limit(1);

      if (existingUserError) {
        console.error('Error checking for existing user:', existingUserError);
        return false;
      }

      // If the user doesn't exist, save them to the database
      if (existingUser.length === 0) {
        const { data: newUser, error } = await supabase.from('users').insert([
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
      else if (existingUser[0].name !== user.name) {
        const { data, error } = await supabase
          .from('users')
          .update({ name: user.name })
          .eq('id', existingUser[0].id);

        if (error) {
          console.error('Error updating user name:', error);
          return false;
        }
      }

      return true;
    },
    async session({ session }) {
      let { user } = session;
      const { data } = await supabase
        .from('users')
        .select()
        .eq('email', user?.email);

      if (data && data.length > 0) {
        session.user = {
          ...user,
          ...data[0],
        };
      }

      return session;
    },
  },
};

export default NextAuth(options);
