import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  PresentationChartLineIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';
import { ChartBarIcon as BarChartIcon } from '@heroicons/react/24/solid';
import {
  Button,
  Callout,
  Card,
  Col,
  Divider,
  Grid,
  SelectBox,
  SelectBoxItem,
  Subtitle,
  Text,
  Title,
} from '@tremor/react';
import axios from 'axios';
import downloadjs from 'downloadjs';
import html2canvas from 'html2canvas';
import { NextPage } from 'next';
import { useCallback, useMemo, useState } from 'react';
import Chart from '../components/ChartComponent';
import LoadingDots from '../components/LoadingDots';
import { SegmentedControl } from '../components/atoms/SegmentedControl';
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

const CHART_TYPES = [
  'area',
  'bar',
  'line',
  'composed',
  'scatter',
  'pie',
  'radar',
  'radialbar',
  'treemap',
  'funnel',
];

const NewHome: NextPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState('');
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(false);
  const [shouldRenderChart, setShouldRenderChart] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  const chartComponent = useMemo(() => {
    return <Chart data={chartData} chartType={chartType} />;
  }, [chartData, chartType]);

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
      const chartTypeResponse = await axios.post('/api/get-type', {
        inputData: inputValue,
      });

      if (!CHART_TYPES.includes(chartTypeResponse.data.toLowerCase()))
        return setError(true);

      setChartType(chartTypeResponse.data);

      const libraryPrompt = `Generate a valid JSON in which each element is an object. Strictly using this FORMAT and naming:
[{ "name": "a", "value": 12, "color": "#4285F4" }] for Recharts API. Make sure field name always stays named name. Instead of naming value field value in JSON, name it based on user metric.\n Make sure the format use double quotes and property names are string literals. \n\n${inputValue}\n Provide JSON data only. `;

      const chartDataResponse = await axios.post('/api/parse-graph', {
        prompt: libraryPrompt,
      });

      let parsedData;

      try {
        parsedData = JSON.parse(chartDataResponse.data);
      } catch (error) {
        setError(true);
        console.error('Failed to parse chart data:', error);
      }

      setChartData(parsedData);
      setChartType(chartTypeResponse.data);
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
    const canvas = await html2canvas(element);
    const dataURL = canvas.toDataURL('image/png');
    downloadjs(dataURL, 'chart.png', 'image/png');
  };

  return (
    <Grid numCols={1} numColsSm={2} numColsLg={4} className="gap-4 h-full">
      <Col
        numColSpan={1}
        numColSpanMd={3}
        className="bg-gray-100 rounded-md p-4 border border-gray-200 dark:border-gray-800 dark:bg-gray-900 h-full dot-grid-gradient-light dark:dot-grid-gradient-dark flex justify-center items-center relative"
      >
        <div className="flex absolute top-4 right-4 space-x-4">
          <Button
            variant="light"
            color="gray"
            icon={ArrowPathIcon}
            className="dark:text-gray-100 dark:hover:text-gray-300 outline-none"
          >
            Retry
          </Button>
          <Button
            size="xs"
            color="gray"
            icon={ArrowDownTrayIcon}
            className="dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 outline-none"
            onClick={() => handleDownloadClick('#chart-card')}
          >
            Download
          </Button>
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
                <Card
                  id="chart-card"
                  className="bg-white dark:bg-black dark:ring-gray-800"
                >
                  {showTitle && (
                    <Title className="dark:text-white">{inputValue}</Title>
                  )}
                  {chartComponent}
                </Card>
              )
            )}
          </div>
        )}
      </Col>

      <aside className="h-full shrink-0 w-full flex flex-col justify-between">
        <form id="generate-chart" onSubmit={handleSubmit} className="space-y-4">
          <SectionHeader
            stepNumber={1}
            title="What would you like to visualize?"
          />
          <TextArea
            id="input"
            name="prompt"
            placeholder="Show me a bar chart with COVID-19 cases in London in March 2020..."
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
          <Button variant="light" className="mx-auto" icon={ChevronDownIcon}>
            Advanced
          </Button>
          <SegmentedControl
            items={[
              {
                children: 'Chart',
                icon: ChartBarIcon,
              },
              { children: 'PowerPoint', icon: PresentationChartLineIcon },
            ]}
            fullWidth
          />
          <div>
            <Text className="mb-1 dark:text-gray-400">Chart type</Text>
            <SelectBox>
              <SelectBoxItem
                value="bar"
                text="Bar Chart"
                icon={BarChartIcon}
                className="dark:bg-gray-900 text-gray-100"
              />
              <SelectBoxItem
                value="area"
                text="Area Chart"
                className="dark:bg-gray-900 text-gray-100"
              />
              <SelectBoxItem
                value="line"
                text="Line Chart"
                className="dark:bg-gray-900 text-gray-100"
              />
              <SelectBoxItem
                value="composed"
                text="Composed Chart"
                className="dark:bg-gray-900 text-gray-100"
              />
              <SelectBoxItem
                value="pie"
                text="Pie Chart"
                className="dark:bg-gray-900 text-gray-100"
              />
              <SelectBoxItem
                value="scatter"
                text="Scatter Chart"
                className="dark:bg-gray-900 text-gray-100"
              />
              <SelectBoxItem
                value="radar"
                text="Radar Chart"
                className="dark:bg-gray-900 text-gray-100"
              />
              <SelectBoxItem
                value="radial"
                text="Radial Bar Chart"
                className="dark:bg-gray-900 text-gray-100"
              />
              <SelectBoxItem
                value="treemap"
                text="Treemap"
                className="dark:bg-gray-900 text-gray-100"
              />
              <SelectBoxItem
                value="funnel"
                text="Funnel Chart"
                className="dark:bg-gray-900 text-gray-100"
              />
            </SelectBox>
          </div>

          <Divider className="h-px my-8 dark:bg-gray-800" />

          <SectionHeader stepNumber={2} title="Make any tweaks to the chart" />
          <SelectBox icon={SwatchIcon}>
            <SelectBoxItem value="blue" text="Blue" icon={SwatchIcon} />
            <SelectBoxItem value="purple" text="Purple" icon={SwatchIcon} />
            <SelectBoxItem value="green" text="Green" icon={SwatchIcon} />
            <SelectBoxItem value="pink" text="Pink" icon={SwatchIcon} />
            <SelectBoxItem value="yellow" text="Yellow" icon={SwatchIcon} />
          </SelectBox>
          <div className="flex justify-between w-full">
            <label
              htmlFor="title"
              className="text-gray-500 dark:text-gray-400 text-sm font-normal select-none	"
            >
              Show chart Title
            </label>
            <Toggle
              id="title"
              size="sm"
              label="Show chart Title"
              checked={showTitle}
              setChecked={setShowTitle}
            />
          </div>
          <div className="flex justify-between w-full">
            <label
              htmlFor="legend"
              className="text-gray-500 dark:text-gray-400 text-sm font-normal select-none	"
            >
              Show chart Legend
            </label>
            <Toggle
              id="legend"
              size="sm"
              label="Show chart Legend"
              checked={showLegend}
              setChecked={setShowLegend}
            />
          </div>
        </form>
        <Button
          type="submit"
          form="generate-chart"
          className="w-full"
          icon={PencilSquareIcon}
        >
          Draw Chart
        </Button>
      </aside>
    </Grid>
  );
};

export default NewHome;
