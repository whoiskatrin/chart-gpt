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
import { Colors, getTremorColor } from '../lib/tremor';
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
  color?: Color;
  showLegend?: boolean;
}

//TODO: dynamic keys instead of default value
export const Chart: React.FC<ChartProps> = ({
  data,
  chartType,
  color,
  showLegend = true,
}) => {
  const value = data.length > 0 ? Object.keys(data[0])[1] : 'value';

  const dataFormatter = (number: number) => {
    return Intl.NumberFormat('us').format(number).toString();
  };

  const renderChart = () => {
    chartType = chartType.toLowerCase();
    switch (chartType) {
      case 'area':
        return (
          <AreaChart
            className="h-[350px]"
            data={data}
            index="name"
            categories={[value]}
            colors={[color || 'blue', 'cyan']}
            showLegend={showLegend}
            valueFormatter={dataFormatter}
          />
        );
      case 'bar':
        return (
          <BarChart
            className="h-[350px]"
            data={data}
            index="name"
            categories={[value]}
            colors={[color || 'blue']}
            showLegend={showLegend}
            valueFormatter={dataFormatter}
            layout={'vertical'}
            yAxisWidth={100}
          />
        );
      case 'line':
        return (
          <LineChart
            className="h-[300px]"
            data={data}
            index="name"
            categories={[value]}
            colors={[color || 'blue']}
            showLegend={showLegend}
            valueFormatter={dataFormatter}
          />
        );
      case 'composed':
        return (
          <>
            {showLegend && (
              <Legend
                categories={[value]}
                colors={[color || 'blue', color || 'blue']}
                className="mb-5 justify-end"
              />
            )}
            <ComposedChart width={500} height={260} data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tick={{ transform: 'translate(0, 6)' }}
                style={{
                  fontSize: '12px',
                  fontFamily: 'Inter; Helvetica',
                }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                type="number"
                tick={{ transform: 'translate(-3, 0)' }}
                style={{
                  fontSize: '12px',
                  fontFamily: 'Inter; Helvetica',
                }}
              />
              <Tooltip legendColor={getTremorColor(color || 'blue')} />
              <Line
                type="linear"
                dataKey={value}
                stroke={getTremorColor(color || 'blue')}
                dot={false}
                strokeWidth={2}
              />
              <Bar
                dataKey="value"
                name="value"
                type="linear"
                fill={getTremorColor(color || 'blue')}
              />
            </ComposedChart>
          </>
        );
      case 'scatter':
        return (
          <>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || 'blue', color || 'blue']}
                  className="mb-5"
                />
              </div>
            )}
            <ScatterChart width={500} height={260} data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tick={{ transform: 'translate(0, 6)' }}
                style={{
                  fontSize: '12px',
                  fontFamily: 'Inter; Helvetica',
                }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                type="number"
                tick={{ transform: 'translate(-3, 0)' }}
                style={{
                  fontSize: '12px',
                  fontFamily: 'Inter; Helvetica',
                }}
              />
              <Tooltip legendColor={getTremorColor(color || 'blue')} />
              <Scatter dataKey={value} fill={getTremorColor(color || 'blue')} />
            </ScatterChart>
          </>
        );
      case 'pie':
        return (
          <DonutChart
            className="h-[300px]"
            data={data}
            category={value}
            index="name"
            colors={[
              (color as Color) || 'cyan',
              'violet',
              'rose',
              'amber',
              'emerald',
              'teal',
              'fuchsia',
            ]}
            // No actual legend for pie chart, but this will toggle the central text
            showLabel={showLegend}
            valueFormatter={dataFormatter}
          />
        );
      case 'radar':
        return (
          <>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || 'blue', color || 'blue']}
                  className="mb-5"
                />
              </div>
            )}
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
              <Tooltip legendColor={getTremorColor(color || 'blue')} />
              <Radar
                dataKey="value"
                stroke={getTremorColor(color || 'blue')}
                fill={getTremorColor(color || 'blue')}
                fillOpacity={0.6}
              />
            </RadarChart>
          </>
        );
      case 'radialbar':
        return (
          <>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || 'blue', color || 'blue']}
                  className="mb-5"
                />
              </div>
            )}
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
                label={{
                  position: 'insideStart',
                  fill: getTremorColor(color || 'blue'),
                }}
                dataKey="value"
              />
              <Tooltip legendColor={getTremorColor(color || 'blue')} />
            </RadialBarChart>
          </>
        );
      case 'treemap':
        return (
          <>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || 'blue', color || 'blue']}
                  className="mb-5"
                />
              </div>
            )}
            <Treemap
              width={500}
              height={260}
              data={data}
              dataKey="value"
              stroke="#fff"
              fill={getTremorColor(color || 'blue')}
              content={<CustomCell colors={Object.values(Colors)} />}
            >
              <Tooltip legendColor={getTremorColor(color || 'blue')} />
            </Treemap>
          </>
        );
      case 'funnel':
        return (
          <>
            {showLegend && (
              <div className="flex justify-end">
                <Legend
                  categories={[value]}
                  colors={[color || 'blue', color || 'blue']}
                  className="mb-5"
                />
              </div>
            )}
            <FunnelChart width={500} height={300} data={data}>
              <Tooltip legendColor={getTremorColor(color || 'blue')} />
              <Funnel dataKey="value" color={getTremorColor(color || 'blue')} />
            </FunnelChart>
          </>
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
