import React, { useState } from "react";
import { Header } from "../components/Header";
import { Chart } from "../components/ChartComponent";
import axios from "axios";
import SquigglyLines from "../components/SquigglyLines";
import LoadingDots from "../components/LoadingDots";
import Head from "next/head";

const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState("");
  const [chartData, setChartData] = useState([]);

  const generateChartData = async (prompt: string) => {
    try {
      const response = await axios.post("/api/parse-graph", { prompt });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to generate chart data:", error);
      throw error;
    }
  };

  const getChartType = async (inputData: string) => {
    try {
      const response = await axios.post("/api/get-type", { inputData });
      return response;
    } catch (error) {
      console.error("Failed to generate chart type:", error);
      throw error;
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsLoading(true);
    console.log(inputValue);
    const chartType = await getChartType(inputValue);

    try {
      const libraryPrompt = `Generate a valid JSON in which each element is an object. Strictly using this FORMAT and naming:
[{ "name": "a", "value": 12 }] for the following description for Recharts. \n\n${inputValue}\n`;

      const chartDataGenerate = await generateChartData(libraryPrompt);

      try {
        setChartData(JSON.parse(chartDataGenerate));
        setChartType(chartType.data);
      } catch (error) {
        console.error("Failed to parse chart data:", error);
      }
    } catch (error) {
      console.error("Failed to generate graph data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-4 items-center justify-center min-h-screen bg-gradient-to-r from-slate-300 to-indigo-50 overflow-x-hidden">
      <Header />
      <Head>
        <title>
          Tool that converts text into beautiful charts
        </title>
      </Head>
      <div className="flex flex-col items-center w-full max-w-xl mb-6 gap-6 border-gray-300 bg-indigo-50 dark:text-white dark:bg-black dark:border dark:border-white/20 rounded-2xl p-2">
        <form onSubmit={handleSubmit} className="w-full max-w-xl mb-6">
          <div className="flex flex-col items-center justify-center">
            <label
              htmlFor="textInput"
              className="block font-inter font-semibold text-gray-700 dark:text-gray-200"
            >
              Describe your data and desired chart:
              <SquigglyLines />
            </label>

            <textarea
              id="input"
              rows={3}
              placeholder=""
              className="appearance-none font-inter mt-8 border border-gray-300 dark:border-gray-600 shadow-sm flex flex-col items-center justify-center rounded-lg w-full max-w-md py-2 px-3 bg-custom-gray-bg dark:bg-custom-dark-gray text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline text-center"
              value={inputValue}
              autoFocus
              onChange={(e) => setInputValue(e.target.value)}
            />

            <button
              type="submit"
              className="cursor-pointer font-inter font-semibold py-2 px-4 mt-10 rounded-full blue-button-w-gradient-border text-white text-shadow-0_0_1px_rgba(0,0,0,0.25) shadow-2xl flex flex-row items-center justify-center mt-3"
            >
              Draw
            </button>
          </div>
        </form>
      </div>
      {chartData && chartType && (
        <div className="w-full max-w-2xl mb-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <LoadingDots color={"blue"} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <Chart data={chartData} chartType={chartType} />
            </div>
          )}
        </div>
      )}

      <footer className="text-center font-inter text-gray-700 text-sm mb-4">
        Made with ❤️ using React, Next.js, OpenAI and Tailwind CSS
      </footer>
    </div>
  );
};

export default HomePage;
