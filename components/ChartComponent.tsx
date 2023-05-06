import {
  AreaChart,
  BarChart,
  DonutChart,
  Legend,
  LineChart,
} from '@tremor/react';
import React from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Funnel,
  FunnelChart,
  Line,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Treemap,
  XAxis,
  YAxis,
} from 'recharts';
import { CustomCell } from './CustomCell';
import { Tooltip } from './CustomTooltip';

export type Color =
  | 'blue'
  | 'rose'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink';
interface ChartProps {
  data: any;
  chartType: string;
  color?: Color[];
  showLegend?: boolean;
}

const colors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#E7E9ED',
  '#FFA1B5',
  '#52B0F5',
  '#FFDA7D',
  '#66C2A5',
  '#AB63FA',
  '#FFB74D',
  '#A9A9A9',
  '#8DD3C7',
  '#FDB462',
  '#FB8072',
  '#80B1D3',
  '#BEBADA',
  '#FCCDE5',
  '#BC80BD',
  '#CCEBC5',
  '#FFED6F',
  '#1696D2',
  '#D2E3F3',
  '#F76F8E',
  '#5C940D',
  '#FF5A5F',
  '#7BCCC4',
  '#BA68C8',
  '#8E0152',
];

//TODO: dynamic keys instead of default value
export const Chart: React.FC<ChartProps> = ({
  data,
  chartType,
  color,
  showLegend = true,
}) => {
  const value = data.length > 0 ? Object.keys(data[0])[1] : 'value';
  const renderChart = () => {
    chartType = chartType.toLowerCase();
    switch (chartType) {
      case 'area':
        return (
          <AreaChart
            className="h-[300px]"
            data={data}
            index="name"
            categories={[value]}
            colors={color || ['blue', 'cyan']}
            showLegend={showLegend}
          />
        );
      case 'bar':
        return (
          <BarChart
            className="h-[300px]"
            data={data}
            index="name"
            categories={[value]}
            colors={color || ['blue']}
            showLegend={showLegend}
          />
        );
      case 'line':
        return (
          <LineChart
            className="h-[300px]"
            data={data}
            index="name"
            categories={[value]}
            colors={color || ['blue']}
            showLegend={showLegend}
          />
        );
      case 'composed':
        return (
          <ComposedChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {showLegend && <Legend categories={[value]} />}
            <Line type="monotone" dataKey={value} stroke="#8884d8" />
            <Bar dataKey="value" fill="#413ea0" />
          </ComposedChart>
        );
      case 'scatter':
        return (
          <ScatterChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {showLegend && <Legend categories={[value]} />}
            <Scatter dataKey={value} fill="#8884d8" />
          </ScatterChart>
        );
      case 'pie':
        return (
          <DonutChart
            className="h-[300px]"
            data={data}
            category={value}
            index="name"
            colors={
              color || ['blue', 'purple', 'yellow', 'green', 'pink', 'cyan']
            }
            // No actual legend for pie chart, but this will toggle the central text
            showLabel={showLegend}
          />
        );
      case 'radar':
        return (
          <RadarChart
            cx={300}
            cy={250}
            outerRadius={150}
            width={600}
            height={500}
            data={data}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Tooltip />
            {showLegend && <Legend categories={[value]} />}
            <Radar
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
        );
      case 'radialbar':
        return (
          <RadialBarChart
            width={500}
            height={300}
            cx={150}
            cy={150}
            innerRadius={20}
            outerRadius={140}
            barSize={10}
            data={data}
          >
            <RadialBar
              angleAxisId={15}
              label={{ position: 'insideStart', fill: '#fff' }}
              dataKey="value"
            />
            {showLegend && <Legend categories={[value]} />}
          </RadialBarChart>
        );
      case 'treemap':
        return (
          <Treemap
            width={500}
            height={300}
            data={data}
            dataKey="value"
            stroke="#fff"
            fill="#8884d8"
            content={<CustomCell colors={colors} />}
          >
            <Tooltip />
          </Treemap>
        );
      case 'funnel':
        return (
          <FunnelChart width={500} height={300} data={data}>
            <Tooltip />
            <Funnel dataKey="value" />
          </FunnelChart>
        );
      default:
        return <p>Unsupported chart type.</p>;
    }
  };

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default Chart;
