import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PolarAngleAxis,
  ComposedChart,
  ScatterChart,
  PolarGrid,
  PieChart,
  PolarRadiusAxis,
  Pie,
  RadarChart,
  Radar,
  RadialBarChart,
  RadialBar,
  Sankey,
  Treemap,
  FunnelChart,
  Funnel,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
  Legend,
  Cell,
} from "recharts";
import { CustomCell } from "./CustomCell";

interface ChartProps {
  data: any;
  chartType: string;
}

function mixColors(colors: string[], randomFactor = 0.2): string {
  // Convert hex color values to RGB
  const rgbColors = colors.map(color => {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    return [r, g, b];
  });

  // Calculate average color values with added randomness
  const avgColor = rgbColors.reduce((acc, val) => {
    return [acc[0] + val[0], acc[1] + val[1], acc[2] + val[2]];
  }, [0, 0, 0]).map(val => {
    const baseVal = Math.round(val / rgbColors.length);
    const randomVal = baseVal * (1 + randomFactor * (Math.random() * 2 - 1));
    return Math.max(0, Math.min(255, randomVal));
  });

  // Convert average RGB values to hex
  const hexColor = '#' + avgColor.map(val => {
    const hexVal = val.toString(16);
    return hexVal.length === 1 ? '0' + hexVal : hexVal;
  }).join('');

  return hexColor;
}

//TODO: dynamic keys instead of default value
export const Chart: React.FC<ChartProps> = ({ data, chartType }) => {
  console.log("Chart data:", data, "Chart type:", chartType);

  const renderChart = () => {
    const colors = data.map((d: { color: any; }) => d.color);
    const color = mixColors(colors);
    chartType = chartType.toLowerCase();
    switch (chartType) {
      case "area":
        return (
          <AreaChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" fill={color} />
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={color} />
          </BarChart>
        );
      case "line":
        return (
          <LineChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={color} />
          </LineChart>
        );
      case "composed":
        return (
          <ComposedChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <Bar dataKey="value" fill="#413ea0" />
          </ComposedChart>
        );
      case "scatter":
        return (
          <ScatterChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Scatter dataKey="value" fill="#8884d8" />
          </ScatterChart>
        );
      case "pie":
        return (
          <PieChart width={500} height={300}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              fill="#8884d8"
              label
            >
              {colors.map((color: any, index: number) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
              </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case "radar":
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
      case "radialBar":
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
              label={{ position: "insideStart", fill: "#fff" }}
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
      case "treemap":
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
      case "funnel":
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

  return <div>{renderChart()}</div>;
};

export default Chart;
