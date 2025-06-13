import React from 'react'
import { BarChart, LineChart, AreaChart, DonutChart } from '@tremor/react'

// Simple hardcoded test to verify Tremor works
export const TremorTestComponent: React.FC = () => {
  const salesData = [
    { name: 'Jan', Sales: 2400, Profit: 400 },
    { name: 'Feb', Sales: 1398, Profit: 300 },
    { name: 'Mar', Sales: 9800, Profit: 200 },
    { name: 'Apr', Sales: 3908, Profit: 278 },
    { name: 'May', Sales: 4800, Profit: 189 },
    { name: 'Jun', Sales: 3800, Profit: 239 },
  ]

  const pieData = [
    { name: 'A', value: 400 },
    { name: 'B', value: 300 },
    { name: 'C', value: 200 },
    { name: 'D', value: 100 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white">
      <div>
        <h3 className="text-lg font-semibold mb-4">Test Bar Chart</h3>
        <BarChart
          className="h-72"
          data={salesData}
          index="name"
          categories={['Sales', 'Profit']}
          colors={['blue', 'teal']}
          valueFormatter={(number: number) =>
            `$ ${Intl.NumberFormat('us').format(number).toString()}`
          }
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Test Line Chart</h3>
        <LineChart
          className="h-72"
          data={salesData}
          index="name"
          categories={['Sales']}
          colors={['emerald']}
          valueFormatter={(number: number) =>
            `$ ${Intl.NumberFormat('us').format(number).toString()}`
          }
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Test Area Chart</h3>
        <AreaChart
          className="h-72"
          data={salesData}
          index="name"
          categories={['Sales', 'Profit']}
          colors={['indigo', 'rose']}
          valueFormatter={(number: number) =>
            `$ ${Intl.NumberFormat('us').format(number).toString()}`
          }
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Test Donut Chart</h3>
        <DonutChart
          className="h-72"
          data={pieData}
          category="value"
          index="name"
          colors={['slate', 'violet', 'indigo', 'rose']}
          valueFormatter={(number: number) => number.toString()}
        />
      </div>
    </div>
  )
}

export default TremorTestComponent