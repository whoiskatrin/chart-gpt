import {
  ChartBarIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  PresentationChartLineIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';
import { ChartBarIcon as BarChartIcon } from '@heroicons/react/24/solid';
import {
  Button,
  Col,
  Divider,
  Grid,
  SelectBox,
  SelectBoxItem,
  Subtitle,
  Text,
} from '@tremor/react';
import { NextPage } from 'next';
import { useCallback, useState } from 'react';
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

const NewHome: NextPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [showTitle, setShowTitle] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: { preventDefault: () => void }) => {},
    []
  );

  return (
    <Grid numCols={1} numColsSm={2} numColsLg={4} className="gap-4 h-full">
      <Col
        numColSpan={1}
        numColSpanMd={3}
        className="bg-gray-100 rounded-md p-4 border border-gray-200 dark:border-gray-800 dark:bg-gray-900 h-full dot-grid-gradient-light dark:dot-grid-gradient-dark"
      >
        main section
      </Col>
      <aside className="h-full space-y-4 shrink-0 w-full">
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
          <Text className="mb-1">Chart type</Text>
          <SelectBox>
            <SelectBoxItem value="bar" text="Bar Chart" icon={BarChartIcon} />
            <SelectBoxItem value="area" text="Area Chart" />
            <SelectBoxItem value="line" text="Line Chart" />
            <SelectBoxItem value="composed" text="Composed Chart" />
            <SelectBoxItem value="pie" text="Pie Chart" />
            <SelectBoxItem value="scatter" text="Scatter Chart" />
            <SelectBoxItem value="radar" text="Radar Chart" />
            <SelectBoxItem value="radial" text="Radial Bar Chart" />
            <SelectBoxItem value="treemap" text="Treemap" />
            <SelectBoxItem value="funnel" text="Funnel Chart" />
          </SelectBox>
        </div>

        <Divider className="h-px my-8" />

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
            className="text-gray-500 text-sm font-normal select-none	"
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
            className="text-gray-500 text-sm font-normal select-none	"
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
        <Button className="w-full" icon={PencilSquareIcon}>
          Draw Chart
        </Button>
      </aside>
    </Grid>
  );
};

export default NewHome;
