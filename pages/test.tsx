import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import { Chart } from "../components/ChartComponent";
import ApiKey from "../components/ApiKey";
import Modal from "../components/Modal";
import LoadingDots from "../components/LoadingDots";
import ChatBubble from "../components/ChatBubble";

const HomePage = () => {
  const [apiKey, setApiKey] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState("");
  const [chartData, setChartData] = useState([]);

  const generateChartData = async (prompt: string) => {
    try {
      const response = await axios.post("/api/parse-graph", { prompt, apiKey });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to generate chart data:", error);
      throw error;
    }
  };

  const getChartType = async (inputData: string) => {
    try {
      const response = await axios.post("/api/get-type", { inputData, apiKey });
      return response;
    } catch (error) {
      console.error("Failed to generate chart type:", error);
      throw error;
    }
  };
  
  const toggleModal = () => {
    setOpenModal(!openModal);
  }

  const setExample = () => {
     setInputValue("Please draw me a bar chart of 1 banana, 2 apples and an orange");
  }
  
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
    <>
      <Head>
        <title>
          Tool that converts text into beautiful charts
        </title>
      </Head>
      <div className="flex flex-col px-4 items-center  min-h-screen bg-gradient-to-r from-slate-300 to-indigo-50 overflow-x-hidden">
        <header className="max-w-xl w-full pt-5 pb-5"> 
          <Link href="/">
            <h1 className="font-bold sm:text-3xl flex bg-gradient-to-r from-sky-400 via-violet-600 to-rose-500 bg-clip-text bg-gradient-to-r from-sky-400 via-violet-600 to-rose-500 bg-clip-text text-transparent">
              <img
                src="https://www.svgrepo.com/show/572/lasso.svg"
                width="24"
                height="24"
                className="mr-2 filter brightness-0"
              />
              ChartGPT
            </h1>
            <p className="text-gray-700">
              A tool that converts text into beautiful charts
            </p>
          </Link>
        </header>
        <div className="flex flex-col items-center w-full max-w-xl p-2 rounded-2xl border-gray-300 bg-indigo-50 dark:text-white dark:bg-black dark:border dark:border-white/20">
          <div className="w-full bg-white rounded-2xl">
            <ChatBubble show={false} wait={100} showLoading={true}>
              ℹ️ ChartGPT was created with ❤️ by Kate. Follow on 
                <a
                  href="https://github.com/whoiskatrin/chart-gpt"
                  target="_blank"
                  className="rounded-full text-gray-500 dark:text-gray-400"
                > Twitter </a> 
                or ⭐ on 
                <a 
                  href="https://github.com/whoiskatrin/chart-gpt" 
                  target="_blank"
                  className="rounded-full text-gray-500 dark:text-gray-400"
                > GitHub </a> 
                for updates!
            </ChatBubble>
           
            <ChatBubble show={false} wait={200} showLoading={true}>
              🖌️ Create a graph by describing your data and desired chart (e.g 
              <a className="rounded-full text-gray-500 dark:text-gray-400" href="#" onClick={setExample}> try this</a>). 
              Add your API Key <a href="#" onClick={toggleModal} className="rounded-full text-gray-500 dark:text-gray-400"> here </a> to avoid rate limits 👌
            </ChatBubble>
            
            <div className="mb-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <LoadingDots color={"blue"} />
              </div>
            ) : (
              chartData &&
              chartType && (
                <div className="flex items-center justify-center h-96">
                  <Chart data={chartData} chartType={chartType} />
                </div>
              )
            )}
            </div>
          </div>
          <div className="flex flex-col w-full max-w-xl p-2">
            <form onSubmit={handleSubmit} className="flex flex-row w-full gap-2 max-w-xl">
              <textarea
                id="input"
                rows={3}
                placeholder=""
                className="appearance-none font-inter basis-4/5 border border-gray-300 dark:border-gray-600 shadow-sm rounded-lg py-2 px-3 bg-custom-gray-bg dark:bg-custom-dark-gray text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                value={inputValue}
                autoFocus
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="cursor-pointer font-inter font-semibold basis-1/5 rounded-xl blue-button-w-gradient-border text-white text-shadow-0_0_1px_rgba(0,0,0,0.25) shadow-2xl"
              >
                Draw
              </button>
            </form> 
          </div>
          {apiKey !== "" ? 
            <div className="text-sm w-full text-align-left pl-2">
              🟢 Using custom  <a href="#" onClick={toggleModal} className="rounded-full text-gray-500 dark:text-gray-400"> API Key </a>
            </div>
            :
            null
          }
          <Modal openModal={openModal} title="Set OpenAI API Key" toggleModal={toggleModal}>
            <ApiKey apiKey={apiKey} setApiKey={setApiKey} />
          </Modal>
        </div>

        <footer className="text-center font-inter text-gray-700 text-sm mt-4">
          Made with ❤️ using React, Next.js, OpenAI and Tailwind CSS
        </footer>
      </div>
    </>
)};

export default HomePage;
