import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import {
  Button,
  Callout,
  Card,
  Col,
  Divider,
  Grid,
  Subtitle,
  Title,
} from '@tremor/react';
import axios from 'axios';
import { toPng } from 'html-to-image';

import download from 'downloadjs';
import { NextPage } from 'next';
import React, { useCallback, useMemo, useState } from 'react';
import Chart from '../components/ChartComponent';
import Github from '../components/GitHub';
import LoadingDots from '../components/LoadingDots';
import { TextArea } from '../components/atoms/TextArea';
import { Toggle } from '../components/atoms/Toggle';

const SectionHeader = ({
  stepNumber,
  title,
}: {
  stepNumber: number;
  title: string;
}) => {
  return (
    <div className="flex items-center">
      <div className="bg-blue-100 dark:bg-blue-500/20 text-blue-500 font-semi-bold font-mono mr-2 h-6 w-6 rounded-full flex items-center justify-center">
        {stepNumber}
      </div>
      <Subtitle className="text-gray-700 dark:text-gray-300">{title}</Subtitle>
    </div>
  );
};

const NewHome: NextPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(false);
  const [shouldRenderChart, setShouldRenderChart] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  const chartComponent = useMemo(() => {
    return (
      <Chart
        data={chartData}
      />
    );
  }, [chartData, chartType, showLegend]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
    },
    []
  );

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    setError(false);
    setIsLoading(true);

    try {
      const chartTypeResponse = await axios.post('/api/get-json', {
        inputData: inputValue,
      });

      console.log({ res: chartTypeResponse.data });


      let parsedData;
      try {
        parsedData = JSON.parse(chartTypeResponse.data);
      } catch (error) {
        setError(true);
        console.error('Failed to parse chart data:', error);
      }

      setChartData(parsedData);
      setShouldRenderChart(true);
    } catch (error) {
      setError(true);
      console.error('Failed to generate graph data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = async (selector: string) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) {
      return;
    }
    toPng(element).then(function (dataUrl) {
      download(dataUrl, 'roadmap.png');
    });
  };

  return (
    <Grid
      numCols={1}
      numColsSm={2}
      numColsLg={3}
      className="gap-y-4 lg:gap-x-4 h-full "
    >
      <aside className="shrink-0 w-full flex flex-col  lg:col-span-1 col-span-12">
        <form id="generate-chart" onSubmit={handleSubmit} className="space-y-4">
          <SectionHeader
            stepNumber={1}
            title="What would you like a roadmap?"
          />
          <TextArea
            id="input"
            name="prompt"
            placeholder="e.g frontend"
            value={inputValue}
            required
            autoFocus
            onChange={handleInputChange}
            onKeyDown={event => {
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                handleSubmit(event);
              }
            }}
          />
          

          <div className="py-2">
            <Divider className="h-px dark:bg-black" />
          </div>

          <SectionHeader stepNumber={2} title="Make any tweaks to the roadmap" />

          <div className="flex justify-between w-full">
            <label
              htmlFor="title"
              className="text-zinc-500 dark:text-zinc-400 text-sm font-normal select-none	"
            >
              Show Roadmap Title
            </label>
            <Toggle
              id="title"
              size="sm"
              label="Show Roadmap Title"
              checked={showTitle}
              setChecked={setShowTitle}
            />
          </div>
        </form>
        <Button
          type="submit"
          form="generate-chart"
          className="w-full cursor-pointer py-2 px-4 mt-4 mb-4 lg:mb-0 rounded-full blue-button-w-gradient-border [text-shadow:0_0_1px_rgba(0,0,0,0.25)] shadow-2xl items-center justify-center false"
          icon={PencilSquareIcon}
        >
          Generate Roadmap
        </Button>
      </aside>

      <Col
        numColSpan={1}
        numColSpanSm={2}
        numColSpanMd={2}
        className="bg-zinc-100 rounded-md py-12 px-4 lg:py-4 border border-zinc-200 dark:border-zinc-900 dark:bg-black h-full dot-grid-gradient-light dark:dot-grid-gradient-dark flex justify-center items-center relative"
      >
        <div className="flex absolute top-4 left-4">
          <a
            href="https://github.com/whoiskatrin/chart-gpt"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button
              size="xs"
              color="zinc"
              variant="secondary"
              icon={Github}
              className="dark:hover:bg-zinc-500/25 dark:text-zinc-100 rounded-full flex items-center justify-center text-sm font-medium px-4 py-1 text-black bg-white dark:bg-black"
            >
              Star on GitHub
            </Button>
          </a>
        </div>
        <div className="flex absolute top-4 right-4 space-x-4">
          {(chartData == undefined || chartData?.length > 0) && (
            <Button
              variant="light"
              color="gray"
              icon={ArrowPathIcon}
              className="dark:text-zinc-100 dark:hover:text-zinc-300 outline-none"
              type="submit"
              form="generate-chart"
            >
              Retry
            </Button>
          )}
          {shouldRenderChart && (
            <Button
              size="xs"
              color="gray"
              icon={ArrowDownTrayIcon}
              className="dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 outline-none"
              onClick={() => handleDownloadClick('#chart-card')}
            >
              Download
            </Button>
          )}
        </div>

        {error ? (
          <Callout
            className="my-6"
            title="Something went wrong! Common issues:"
            color="rose"
          >
            <ul className="list-disc list-inside">
              <li>Try modifying the prompt, make it as clear as possible </li>
            </ul>
          </Callout>
        ) : (
          <div className="w-full max-w-xl p-4 mt-5">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <LoadingDots />
              </div>
            ) : (
              shouldRenderChart && (
                <Card
                  id="chart-card"
                  className="bg-transparent dark:bg-transparent ring-transparent ring-0 border-transparent shadow-none"
                >
                  {showTitle && (
                    <Title className="dark:text-white text-center pb-5 capitalize">{inputValue}</Title>
                  )}
                  {!showLegend && <div className="h-5" />}
                  {chartComponent}
                </Card>
              )
            )}
          </div>
        )}
      </Col>
    </Grid>
  );
};

export default NewHome;
