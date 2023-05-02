import { Callout, Card, Title } from "@tremor/react";
import axios from "axios";
import downloadjs from "downloadjs";
import html2canvas from "html2canvas";
import Head from "next/head";
import React, { useMemo, useState } from "react";
import { Chart } from "../components/ChartComponent";
import { Header } from "../components/Header";
import InfoSection from "../components/InfoSection";
import LoadingDots from "../components/LoadingDots";
import { useTheme } from "next-themes";
import ThemeButton from "../components/ThemeButton";

const CHART_TYPES = [
  "area",
  "bar",
  "line",
  "composed",
  "scatter",
  "pie",
  "radar",
  "radialbar",
  "treemap",
  "funnel",
];

const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState("");
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(false);
  const [shouldRenderChart, setShouldRenderChart] = useState(false);

  const { resolvedTheme } = useTheme();
  const svgFillColor = resolvedTheme === "dark" ? "#D8D8D8" : "black";
  const btnBgColor =
    resolvedTheme === "dark"
      ? "dark-button-w-gradient-border"
      : "light-button-w-gradient-border";

  const chartComponent = useMemo(() => {
    return <Chart data={chartData} chartType={chartType} />;
  }, [chartData, chartType]);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    setError(false);
    setIsLoading(true);

    try {
      const chartTypeResponse = await axios.post("/api/get-type", {
        inputData: inputValue,
      });

      if (!CHART_TYPES.includes(chartTypeResponse.data.toLowerCase()))
        return setError(true);

      setChartType(chartTypeResponse.data);

      const libraryPrompt = `Generate a valid JSON in which each element is an object. Strictly using this FORMAT and naming:
[{ "name": "a", "value": 12, "color": "#4285F4" }] for Recharts API. Make sure field name always stays named name. Instead of naming value field value in JSON, name it based on user metric.\n Make sure the format use double quotes and property names are string literals. \n\n${inputValue}\n Provide JSON data only. `;

      const chartDataResponse = await axios.post("/api/parse-graph", {
        prompt: libraryPrompt,
      });

      let parsedData;

      try {
        parsedData = JSON.parse(chartDataResponse.data);
      } catch (error) {
        setError(true);
        console.error("Failed to parse chart data:", error);
      }

      setChartData(parsedData);
      setChartType(chartTypeResponse.data);
      setShouldRenderChart(true);
    } catch (error) {
      setError(true);
      console.error("Failed to generate graph data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
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
    <div className="flex flex-col px-4 items-center justify-center bg-white text-black dark:text-white dark:bg-black overflow-y-hidden">
      <Header />
      <Head>
        <title>AI tool to convert text to a beautiful chart</title>
      </Head>
      <ThemeButton className="absolute top-2.5 right-2.5 text-gray-500 dark:text-gray-400 focus:outline-none hover:scale-125 transition" />
      <div className="w-full max-w-xl mb-6 space-6 bg-white text-black dark:text-white dark:bg-black">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl mb-1 bg-white text-black dark:text-white dark:bg-black rounded-lg"
        >
          <div className="flex flex-col items-center justify-center rounded-lg">
            <label
              htmlFor="textInput"
              className="block font-sans font-semibold bg-white text-black dark:text-white dark:bg-black flex flex-row py-2 px-4"
            >
              <img
                src="/stars.svg"
                className="p-1"
                style={{
                  filter: resolvedTheme === "dark" ? "invert(0)" : "invert(1)",
                  fill: resolvedTheme === "dark" ? "white" : "black",
                }}
              />
              What would you like to visualise?
            </label>
            <textarea
              id="input"
              rows={3}
              placeholder=""
              className="bg-custom-gray-bg text-black dark:text-white dark:bg-zinc-800  appearance-none font-inter mt-8  dark:border-white/20 shadow-sm flex flex-col items-center justify-center rounded-lg w-full max-w-md py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-left min-h-[120px] max-h-[200px]"
              value={inputValue}
              required
              autoFocus
              onChange={handleInputChange}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  handleSubmit(event);
                }
              }}
            />
            <button
              type="submit"
              className="cursor-pointer font-inter font-semibold border-white/20 py-2 px-5 mt-5 mb-5 rounded-full blue-button-w-gradient-border text-white text-shadow-0_0_1px_rgba(0,0,0,0.25) shadow-2xl flex flex-row items-center justify-center"
            >
              <div className="relative text-sm font-semibold font-inter text-white text-center inline-block mx-auto">
                Make things happen
                <div className="text-blue-300">⌘+⏎</div>
              </div>
            </button>
          </div>
        </form>
      </div>
      {error ? (
        <Callout
          className="mb-6"
          title="Ooops! Could not generate"
          color="rose"
        >
          Try again later or restructure your request.
        </Callout>
      ) : (
        <div className="w-full max-w-xl mb-6 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <LoadingDots />
            </div>
          ) : (
            shouldRenderChart && (
              <>
                <Card className="bg-white dark:bg-zinc-300">
                  <Title>{inputValue}</Title>
                  {chartComponent}
                </Card>
                <div className="flex flex-col items-center justify-center p-4">
                  <button
                    type="button"
                    className="cursor-pointer font-inter font-semibold py-2 px-4 mt-10 rounded-full blue-button-w-gradient-border text-white text-shadow-0_0_1px_rgba(0,0,0,0.25) shadow-2xl flex flex-row items-center justify-center"
                    onClick={() => handleCaptureClick(".recharts-wrapper")}
                  >
                    Download
                  </button>
                </div>
              </>
            )
          )}
        </div>
      )}
      <h1 className="text-4xl mb-6 xl:text-4xl font-extrabold text-center xl:text-left text-black dark:text-white">
        Get a new chart in a few steps
      </h1>
      <InfoSection />
      <footer className="text-center font-sans text-black dark:text-white text-ml mb-10">
        Made with ❤️ using React, Next.js, Recharts, Tremor, OpenAI and Tailwind
        CSS
        <h4 className="text-blue-500">Enquries: @whoiskatrin </h4>
      </footer>
    </div>
  );
};

export default HomePage;
