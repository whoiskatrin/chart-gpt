import React, { useState } from "react";
import { Header } from "../components/Header";
import { useTheme } from "next-themes";
import Head from "next/head";
import TranslatedDesign from "../components/TranslatedDesign";
import ThemeButton from "../components/ThemeButton";

const HomePage: React.FC = () => {
  const [figmaLink, setFigmaLink] = useState("");
  const [designData, setDesignData] = useState<any>(null);
  const [tailwindDesign, setTailwindDesign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch(`/api/figma-to-tailwind`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        figmaLink,
      }),
    });

    const data = await response.json();
    setDesignData(data.designData);
    setTailwindDesign(data.tailwindDesign);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col px-4 items-center justify-center min-h-screen bg-gradient-to-r from-slate-600 to-indigo-400 overflow-x-hidden">
      <Header />
      <Head>
        <title>Figma to Tailwind.css</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeButton className="absolute top-2.5 right-2.5 text-gray-500 dark:text-gray-400 focus:outline-none hover:scale-125 transition" />
      <div className="flex flex-col items-center w-full max-w-xl mb-6 gap-6 border-gray-300 bg-indigo-50 dark:text-white dark:bg-black dark:border dark:border-white/20 rounded-2xl p-2">
        <form onSubmit={handleSubmit} className="w-full max-w-xl mb-6">
          <div className="flex flex-col items-center justify-center">
            <label
              htmlFor="figmaLink"
              className="block font-inter font-semibold mb-2 text-gray-700 dark:text-gray-200"
            >
              Figma File Link
            </label>
            <input
              type="text"
              id="figmaLink"
              placeholder="https://www.figma.com/file/..."
              className="appearance-none font-inter border border-gray-300 dark:border-gray-600 shadow-sm flex flex-col items-center justify-center rounded-lg w-full max-w-md py-2 px-3 bg-custom-gray-bg dark:bg-custom-dark-gray text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline text-center"
              value={figmaLink}
              onChange={(e) => setFigmaLink(e.target.value)}
            />

            <button
              type="submit"
              className="cursor-pointer font-inter font-semibold py-2 px-4 rounded-full blue-button-w-gradient-border text-white text-shadow-0_0_1px_rgba(0,0,0,0.25) shadow-2xl flex flex-row items-center justify-center mt-3"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1024px-Tailwind_CSS_Logo.svg.png"
                alt="Tailwind CSS logo"
                width="24"
                height="24"
                className="mr-2"
              />
              Convert to Tailwind
            </button>
          </div>
        </form>

        <div
          className={
            isLoading
              ? "flex items-center justify-center w-full max-w-md mb-6"
              : "hidden"
          }
        >
          {isLoading ? (
            <svg
              className="animate-spin h-10 w-10 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : null}
        </div>
        {designData && tailwindDesign ? (
          <div className="w-full max-w-md mt-6">
            <div className="flex flex-col rounded-xl bg-white container-w-gradient-border dark:dark-container-w-gradient-border dark:bg-custom-gray p-3 h-full w-full">
              <div className="flex flex-col flex-1">
                <div className="designs-container">
                  <TranslatedDesign designData={tailwindDesign} />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col sm:flex-row justify-center space-y-10 sm:space-y-0 sm:space-x-10 mt-10">
        <div className="w-full sm:w-80">
          <blockquote className="twitter-tweet text-xs">
            <p
              className="text-sm font-medium leading-relaxed text-gray-900 dark:text-white"
              lang="en"
              dir="ltr"
            >
              Tailwind CSS is the best thing that happened to frontend
              development since the invention of CSS.
            </p>
            <p className="text-sm leading-5 text-gray-500 dark:text-gray-400 mt-1">
              &mdash; Daniel Vassallo (@dvassallo){" "}
              <a
                className="text-blue-500 dark:text-blue-400"
                href="https://twitter.com/dvassallo/status/1645952548149555201?ref_src=twsrc%5Etfw"
              >
                April 12, 2023
              </a>
            </p>
          </blockquote>
          <script
            async
            className="twitter-js"
            src="https://platform.twitter.com/widgets.js"
          ></script>
        </div>
        <div className="w-full sm:w-80">
          <blockquote className="twitter-tweet text-xs">
            <p
              className="text-sm font-medium leading-relaxed text-gray-900 dark:text-white"
              lang="en"
              dir="ltr"
            >
              Well that’s a milestone 🤯{" "}
              <a
                className="twitter-timeline-link"
                href="https://t.co/QPZxXuBmLO"
              >
                pic.twitter.com/QPZxXuBmLO
              </a>
            </p>
            <p className="text-sm leading-5 text-gray-500 dark:text-gray-400 mt-1">
              &mdash; Adam Wathan (@adamwathan){" "}
              <a
                className="text-blue-500 dark:text-blue-400"
                href="https://twitter.com/adamwathan/status/1527964040240283648?ref_src=twsrc%5Etfw"
              >
                May 21, 2022
              </a>
            </p>
          </blockquote>
          <script
            async
            className="twitter-js"
            src="https://platform.twitter.com/widgets.js"
          ></script>
        </div>
        <div className="w-full sm:w-80">
          <blockquote className="twitter-tweet text-xs">
            <p
              className="text-sm font-medium leading-relaxed text-gray-900 dark:text-white"
              lang="en"
              dir="ltr"
            >
              I really, really like TailwindCSS.
            </p>
            <p className="text-sm leading-5 text-gray-500 dark:text-gray-400 mt-1">
              &mdash; Florin Pop 👨🏻‍💻 (@florinpop1705){" "}
              <a
                className="text-blue-500 dark:text-blue-400"
                href="https://twitter.com/florinpop1705/status/1646906023427317761?ref_src=twsrc%5Etfw"
              >
                April 14, 2023
              </a>
            </p>
          </blockquote>
          <script
            async
            className="twitter-js"
            src="https://platform.twitter.com/widgets.js"
          ></script>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
