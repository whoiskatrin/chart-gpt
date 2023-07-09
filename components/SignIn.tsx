import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@tremor/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const SignIn = ({
  creditsRemaining,
  creditsLoading,
}: {
  creditsRemaining?: number;
  creditsLoading?: boolean;
}) => {
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
        {!creditsLoading && (creditsRemaining || 0) < 2 && (
          <Link href="/buy-credits">
            <Button
              size="xs"
              className="rounded-full font-sans items-center justify-center text-sm font-medium px-4 py-1 blue-button-w-gradient-border hidden sm:flex"
            >
              Buy credits
            </Button>
          </Link>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="secondary"
              color="zinc"
              icon={ChevronDownIcon}
              size="xs"
              iconPosition="right"
              className="border-0 rounded-full flex items-center justify-center text-sm font-medium px-2 py-1 dark:hover:bg-zinc-500/25 dark:text-zinc-100"
            >
              {session.user?.image ? (
                <Avatar>
                  <AvatarImage
                    src={session.user.image}
                    alt="user profile image"
                  />
                  <AvatarFallback>
                    {session.user.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                (session.user?.name || session.user?.email || 'User').charAt(0)
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              Signed in as {session.user?.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/buy-credits">
              <DropdownMenuItem>
                <CreditCardIcon className="mr-2 h-4 w-4" />
                <span>Buy credits</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => handleSignOut()}>
              <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  } else {
    return (
      <Button
        onClick={handleSignIn}
        size="xs"
        className="rounded-full font-sans flex items-center justify-center text-sm font-medium px-4 py-1 blue-button-w-gradient-border"
      >
        Sign in with Google
      </Button>
    );
  }
};

export default SignIn;
