import { AreaChart, BarChart, DonutChart, LineChart } from '@tremor/react';
import React from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Funnel,
  FunnelChart,
  Legend,
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

interface ChartProps {
  data: any;
  chartType: string;
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

function mixColors(colors: string[], randomFactor = 0.1): string {
  // Convert hex color values to RGB
  const rgbColors = colors.map(color => {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    return [r, g, b];
  });

  const avgColor = rgbColors
    .reduce(
      (acc, val) => {
        return [acc[0] + val[0], acc[1] + val[1], acc[2] + val[2]];
      },
      [0, 0, 0]
    )
    .map(val => Math.round(val / rgbColors.length));

  const randomizedColor = avgColor.map(val => {
    const randomVal =
      val + Math.floor((Math.random() * 2 - 1) * randomFactor * val);
    return Math.max(0, Math.min(255, randomVal));
  });

  const hexColor =
    '#' +
    randomizedColor
      .map(val => {
        const hexVal = val.toString(16);
        return hexVal.length === 1 ? '0' + hexVal : hexVal;
      })
      .join('');

  return hexColor;
}

//TODO: dynamic keys instead of default value
export const Chart: React.FC<ChartProps> = ({ data, chartType }) => {
  const color = data.length > 0 ? data[0]['color'] : mixColors(colors);
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
            colors={['indigo', 'cyan']}
          />
        );
      case 'bar':
        return (
          <BarChart
            className="h-[300px]"
            data={data}
            index="name"
            categories={[value]}
            colors={['blue']}
          />
        );
      case 'line':
        return (
          <LineChart
            className="h-[300px]"
            data={data}
            index="name"
            categories={[value]}
            colors={['blue']}
          />
        );
      case 'composed':
        return (
          <ComposedChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
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
            <Legend />
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
            colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
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
            <Legend />
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
            <Legend
              iconSize={10}
              width={120}
              height={140}
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
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
