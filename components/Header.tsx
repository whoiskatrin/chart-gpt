import Link from 'next/link';
import Github from './GitHub';
import { useTheme } from 'next-themes';
import React from 'react';
import SignIn from './SignIn';

export const Header = () => {
  const { resolvedTheme } = useTheme();
  const svgFillColor = resolvedTheme === 'dark' ? '#D8D8D8' : 'black';
  const btnBgColor =
    resolvedTheme === 'dark'
      ? 'dark-button-w-gradient-border'
      : 'light-button-w-gradient-border';

  return (
    <header className="flex flex-col sm:flex-row sm:justify-betweenw-full mb-6 gap-6 pt-4 pb-8 px-2 mt-10 border-b sm:px-4 px-2 border-gray-200">
      <Link href="/" className="flex flex-col">
        <h1 className="font-inter font-bold sm:text-xl flex items-center bg-gradient-to-r from-sky-400 via-violet-600 to-rose-500 bg-clip-text bg-gradient-to-r from-sky-400 via-violet-600 to-rose-500 bg-clip-text text-transparent">
          <img
            src="https://www.svgrepo.com/show/572/lasso.svg"
            width="24"
            height="24"
            className="mr-2"
            style={{
              filter: resolvedTheme === 'dark' ? 'invert(1)' : 'invert(0)',
              fill: resolvedTheme === 'dark' ? 'white' : 'black',
            }}
          />
          ChartGPT
        </h1>
        <p className="font-sans font-bold bg-white text-black dark:text-white dark:bg-black">
          A tool that converts text queries into beautiful charts using AI
        </p>
      </Link>
      <div className="flex items-center gap-3 pt-4">
        <a
          className="rounded-full text-gray-500 dark:text-gray-400"
          href="https://github.com/whoiskatrin/chart-gpt"
          rel="noopener noreferrer"
          target="_blank"
        >
          <div
            className={`flex items-center justify-center space-x-2 py-2 px-6 rounded-full ${btnBgColor} text-black dark:text-[#D8D8D8] text-sm font-medium`}
          >
            <Github />
            <p>Star on GitHub</p>
          </div>
        </a>
        <a
          className={`flex items-center justify-center space-x-2 py-2 px-6 rounded-full ${btnBgColor} text-black text-sm font-medium transition`}
          href="https://twitter.com/whoiskatrin"
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="group " aria-label="Kate on Twitter">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.93892 15.75C12.1654 15.75 15.571 10.5557 15.571 6.05122C15.571 5.90369 15.571 5.75682 15.5611 5.61061C16.2236 5.12807 16.7955 4.5306 17.25 3.84617C16.6322 4.12184 15.9767 4.30262 15.3056 4.38248C16.0123 3.95648 16.5412 3.28645 16.7939 2.49709C16.1294 2.89414 15.4024 3.17396 14.6443 3.32448C14.1339 2.77799 13.4589 2.41612 12.7236 2.29487C11.9884 2.17361 11.234 2.29973 10.5771 2.65372C9.92023 3.0077 9.39753 3.5698 9.08988 4.25305C8.78224 4.93629 8.70681 5.70259 8.87526 6.43335C7.52936 6.36541 6.21269 6.01323 5.01072 5.39967C3.80876 4.78611 2.74837 3.92489 1.8984 2.87191C1.4655 3.62232 1.33291 4.51065 1.52763 5.35604C1.72235 6.20143 2.22973 6.94031 2.94648 7.42224C2.40775 7.40616 1.88076 7.25983 1.41 6.99558C1.41 7.00954 1.41 7.02416 1.41 7.03878C1.41021 7.82578 1.68077 8.58848 2.17579 9.19751C2.6708 9.80654 3.35979 10.2244 4.1259 10.3803C3.62751 10.5171 3.1046 10.5371 2.59734 10.4387C2.81366 11.116 3.23481 11.7083 3.80189 12.1328C4.36896 12.5572 5.05361 12.7926 5.76006 12.8059C4.56133 13.7546 3.0805 14.2696 1.55586 14.268C1.28652 14.2675 1.01743 14.2511 0.75 14.2188C2.29812 15.2192 4.09944 15.7498 5.93892 15.7473"
                fill={svgFillColor}
              />
            </svg>
          </div>
        </a>
        <a
          className="rounded-full text-gray-500 dark:text-gray-400"
          href="https://github.com/whoiskatrin/chart-gpt"
          rel="noopener noreferrer"
          target="_blank"
        >
          <div
            className={`flex items-center justify-center space-x-2 py-2 px-6 rounded-full ${btnBgColor} text-black dark:text-[#D8D8D8] text-sm font-medium`}
          >
            <SignIn />
            <p>Star on GitHub</p>
          </div>
        </a>
      </div>
    </header>
  );
};
