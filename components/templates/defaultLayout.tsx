import { Button } from '@tremor/react';
import { FC, PropsWithChildren } from 'react';
import ThemeButton from '../ThemeButton';

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="h-[calc(100vh-48px)]">
      <nav className="w-full flex items-center justify-between h-12 px-4 border-b border-gray-200 dark:border-gray-800">
        <div>logo here</div>
        <div className="flex space-x-4">
          <Button size="xs" color="gray" variant="secondary">
            Star on GitHub
          </Button>
          <Button size="xs" color="gray" variant="secondary">
            Twitter
          </Button>
          <ThemeButton />
        </div>
      </nav>
      <div className="font-normal p-8">{children}</div>
    </main>
  );
};
