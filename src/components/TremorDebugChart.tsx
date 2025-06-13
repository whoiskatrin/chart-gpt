import React from 'react'
import { BarChart, Card, Title } from '@tremor/react'

// Simple test component to verify Tremor is working
export const TremorDebugChart: React.FC = () => {
  const chartData = [
    { name: 'Jan', Sales: 2400, Profit: 400 },
    { name: 'Feb', Sales: 1398, Profit: 300 },
    { name: 'Mar', Sales: 9800, Profit: 200 },
    { name: 'Apr', Sales: 3908, Profit: 278 },
    { name: 'May', Sales: 4800, Profit: 189 },
    { name: 'Jun', Sales: 3800, Profit: 239 },
  ]

  return (
    <Card className="max-w-lg">
      <Title>Debug Chart Test</Title>
      <BarChart
        className="h-72 mt-4"
        data={chartData}
        index="name"
        categories={['Sales', 'Profit']}
        colors={['blue', 'teal']}
        valueFormatter={(number: number) =>
          `$ ${Intl.NumberFormat('us').format(number).toString()}`
        }
      />
    </Card>
  )
}

export default TremorDebugChart