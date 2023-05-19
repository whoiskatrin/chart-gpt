import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';
import ThemeButton from '../molecules/ThemeButton';

const Logo = () => (
  <b>RoadmapGPT</b>
);

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="h-[calc(100vh-48px)]">
      <nav className="w-full flex items-center justify-between h-12 px-4 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/">
          <Logo />
        </Link>

        <div className="flex space-x-2">
          <ThemeButton />
        </div>
      </nav>
      <div className="font-normal p-8 h-full bg-white dark:bg-black overflow-y-auto">
        {children}
      </div>
    </main>
  );
};
