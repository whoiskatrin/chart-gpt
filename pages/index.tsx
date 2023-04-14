import React, { useState } from "react";
import DesignPreview from "../components/DesignPreview";
import { Header } from "../components/Header";
import { useTheme } from "next-themes";
import Head from "next/head";
import TranslatedDesign from "../components/TranslatedDesign";
import Github from "../components/GitHub";
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-slate-600 to-indigo-400">
      <Header />
      <Head>
        <title>Figma to Tailwind.css</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeButton className="absolute top-2.5 right-2.5 text-gray-500 dark:text-gray-400 focus:outline-none hover:scale-125 transition" />
      <div className="flex flex-col items-center w-full max-w-xl mb-6 gap-6 bg-indigo-50 dark:text-white dark:bg-black dark:border dark:border-white/20 rounded-2xl p-2">
        <div className="w-full max-w-xl mb-6">
          <div className="flex flex-col items-center justify-center">
            <label
              htmlFor="figmaLink"
              className="block font-inter font-medium mb-2 text-gray-700 dark:text-gray-200"
            >
              Figma File Link
            </label>
            <input
              type="text"
              id="figmaLink"
              placeholder="https://www.figma.com/file/xxxx/xxxx"
              className="appearance-none font-inter border-0 flex flex-col items-center justify-center rounded-lg w-full py-2 px-3 bg-custom-gray-bg dark:bg-custom-dark-gray text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline text-center"
              value={figmaLink}
              onChange={(e) => setFigmaLink(e.target.value)}
            />

            <button
              type="submit"
              className="cursor-pointer font-inter font-semibold py-2 px-4 rounded-full blue-button-w-gradient-border text-white text-shadow-0_0_1px_rgba(0,0,0,0.25) shadow-2xl flex flex-col items-center justify-center mt-3"
              // onClick={handleSubmit}
            >
              Convert to Tailwind
            </button>
          </div>
        </div>

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
        <div className="w-full max-w-md mt-6">
          <div className="flex flex-col rounded-xl bg-white container-w-gradient-border dark:dark-container-w-gradient-border dark:bg-custom-gray p-3 h-full w-full">
            <div className="flex flex-col flex-1">
              {designData && tailwindDesign ? (
                <div className="designs-container">
                  <DesignPreview figmaLink={figmaLink} />
                  <TranslatedDesign designData={tailwindDesign} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
