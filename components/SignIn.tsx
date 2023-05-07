import { signIn, signOut, useSession } from 'next-auth/react';

const SignIn = () => {
  const { data: session } = useSession();
  console.log(session);

  async function handleSignIn() {
    signIn('google');
  }

  async function handleSignOut() {
    signOut();
  }

  if (session) {
    return (
      <>
        Signed in as {session.user?.name} <br />
        <button onClick={() => handleSignOut()}>Sign out</button>
      </>
    );
  } else {
    return <button onClick={handleSignIn}>Sign in with Google</button>;
  }
};

export default SignIn;
