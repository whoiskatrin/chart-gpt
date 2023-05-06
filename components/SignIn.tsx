import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const SignIn = () => {
  const { user } = useAuth();

  async function handleSignIn() {
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
    }
  }

  if (user) {
    return (
      <>
        Signed in as {user.user_metadata.full_name} <br />
        <button onClick={() => handleSignOut()}>Sign out</button>
      </>
    );
  } else {
    return <button onClick={handleSignIn}>Sign in with Google</button>;
  }
};

export default SignIn;
