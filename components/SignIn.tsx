import { useEffect, useState } from 'react';
import { supabase } from '../pages/_app';
import { Subscription, User } from '@supabase/supabase-js';

const SignIn = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Subscribe to auth changes (login/logout)
    const authListener = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser || null);

        if (currentUser && event === 'SIGNED_IN') {
          const { data: existingUser, error: existingUserError } =
            await supabase
              .from('users')
              .select()
              .eq('email', currentUser.email)
              .single();

          if (existingUserError) {
            console.error('Error getting user:', existingUserError.message);
          } else if (!existingUser) {
            const { error: createUserError } = await supabase
              .from('users')
              .insert([
                {
                  email: currentUser.email,
                  full_name: currentUser.user_metadata.full_name,
                },
              ]);

            if (createUserError) {
              console.error('Error creating user:', createUserError.message);
            }
          }
        }
      }
    );

    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  async function handleSignIn() {
    // Use Supabase authentication
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error signing in:', error.message);
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      setUser(null);
    }
  }

  if (user) {
    return (
      <span>
        <h1>Welcome, {user.user_metadata.full_name}!</h1>
        <button onClick={handleSignOut}>Sign out</button>
      </span>
    );
  } else {
    return <button onClick={handleSignIn}>Sign in with Google</button>;
  }
};

export default SignIn;
