import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { Icon } from '@tremor/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeButton({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() =>
        currentTheme === 'dark' ? setTheme('light') : setTheme('dark')
      }
      className={className}
    >
      <Icon
        variant="simple"
        color={currentTheme === 'dark' ? 'yellow' : 'blue'}
        icon={currentTheme === 'dark' ? SunIcon : MoonIcon}
        className="dark:text-yellow-500 text-blue-500 rounded-full hidden sm:flex"
      />
    </button>
  );
}
