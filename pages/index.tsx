import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Chart } from "../components/ChartComponent";
import axios from "axios";
import SquigglyLines from "../components/SquigglyLines";
import LoadingDots from "../components/LoadingDots";
import Head from "next/head";
import downloadjs from "downloadjs";
import html2canvas from "html2canvas";
import InfoSection from "../components/InfoSection";

const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState("");
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(false);
  const [drawClicked, setDrawClicked] = useState(false);

  const updateChart = async () => {
    if (!drawClicked) return;

    setError(false);
    setIsLoading(true);

    try {
      const chartTypeResponse = await getChartType(inputValue);
      setChartType(chartTypeResponse.data);

      const libraryPrompt = `Generate a valid JSON in which each element is an object. Strictly using this FORMAT and naming:
    [{ "name": "a", "value": 12, "color": "#4285F4" }] for the following description for Recharts. Instead of naming value field value in JSON, name it based on what user requested.\nFor each object CHOOSE a "color" that is the most recognizable color for that object in your opinion. \n\n${inputValue}\n`;

      const chartDataGenerate = await generateChartData(libraryPrompt);

      try {
        setChartData(JSON.parse(chartDataGenerate));
      } catch (error) {
        setError(true);
        console.error("Failed to parse chart data:", error);
      }
    } catch (error) {
      setError(true);
      console.error("Failed to generate graph data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (drawClicked) {
      updateChart();
    }
  }, [drawClicked]);

  const generateChartData = async (prompt: string) => {
    try {
      const response = await axios.post("/api/parse-graph", { prompt });
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

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setDrawClicked(true); // Set the drawClicked flag to true
  };

  const handleCaptureClick = async (selector: string) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) {
      return;
    }
    const canvas = await html2canvas(element);
    const dataURL = canvas.toDataURL("image/png");
    downloadjs(dataURL, "chart.png", "image/png");
  };

  return (
    <div className="flex flex-col px-4 items-center justify-center min-h-screen bg-gradient-to-r from-slate-300 to-indigo-50 overflow-x-hidden">
      <Header />
      <Head>
        <title>Tool that converts text into beautiful charts</title>
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
              required
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
      {error ? (
        <p style={{ color: "red" }}>Ooops! Could not generate</p>
      ) : (
        <div className="w-full max-w-xl mb-6 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <LoadingDots color={"blue"} />
            </div>
          ) : (
            drawClicked &&
            chartData &&
            chartType && (
              <>
                <div className="flex items-center justify-center p-4">
                  <Chart data={chartData} chartType={chartType} />
                </div>
                <div className="flex flex-col items-center justify-center p-4">
                  <button
                    type="button"
                    className="cursor-pointer font-inter font-semibold py-2 px-4 mt-10 rounded-full blue-button-w-gradient-border text-white text-shadow-0_0_1px_rgba(0,0,0,0.25) shadow-2xl flex flex-row items-center justify-center mt-3"
                    onClick={() => handleCaptureClick(".recharts-wrapper")}
                  >
                    Download
                  </button>
                </div>
              </>
            )
          )}
          <InfoSection />
        </div>
      )}
      <footer className="text-center font-inter text-gray-700 text-sm mb-4">
        Made with ❤️ using React, Next.js, Recharts, OpenAI and Tailwind CSS
      </footer>
    </div>
  );
};

export default HomePage;
