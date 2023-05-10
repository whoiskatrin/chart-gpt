import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Button } from '@tremor/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const SignIn = () => {
  const { data: session } = useSession();

  async function handleSignIn() {
    signIn('google');
  }

  async function handleSignOut() {
    signOut();
  }

  if (session) {
    return (
      <>
        <Button
          variant="secondary"
          color="zinc"
          icon={ChevronDownIcon}
          size="xs"
          iconPosition="right"
          className="border-0 rounded-full flex items-center justify-center text-sm font-medium px-4 py-1 dark:hover:bg-zinc-500/25 dark:text-zinc-100"
        >
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt="user profile image"
              height={24}
              width={24}
              className="h-6 w-6 rounded-full"
            />
          ) : (
            (session.user?.name || session.user?.email || 'User').charAt(0)
          )}
        </Button>
        {/* Signed in as {session.user?.name} <br /> */}
        <Button
          onClick={() => handleSignOut()}
          size="xs"
          className="rounded-full flex items-center justify-center text-sm font-medium px-4 py-1"
        >
          Sign out
        </Button>
      </>
    );
  } else {
    return (
      <Button
        onClick={handleSignIn}
        size="xs"
        className="rounded-full font-sans flex items-center justify-center text-sm font-medium px-4 py-1"
      >
        Sign in with Google
      </Button>
    );
  }
};

export default SignIn;
