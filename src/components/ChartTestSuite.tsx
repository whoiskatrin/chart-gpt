import React, { useState } from 'react'
import ChartRenderer from './ChartRenderer'
import EChartsCustomizationPanel from './EChartsCustomizationPanel'
import { ChartConfig } from '@/types/chart'
import { ECHARTS_COLOR_PALETTES } from '@/lib/echartsDataTransforms'

const TEST_CHARTS: ChartConfig[] = [
  {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Sales',
        data: [45, 52, 38, 61, 49],
        backgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Bar Chart Test' },
        legend: { display: true, position: 'top' as const }
      }
    },
    customization: {
      colors: {
        primary: '#5470c6',
        secondary: '#91cc75',
        accent: '#fac858',
        background: '#ffffff',
        text: '#333333'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: { title: 18, labels: 12, legend: 14 }
      },
      layout: {
        padding: { top: 20, right: 20, bottom: 20, left: 20 }
      },
      animations: { enabled: true, duration: 1000, easing: 'cubicOut' },
      responsive: { enabled: true, breakpoints: { mobile: 480, tablet: 768, desktop: 1024 } },
      colorPalette: 'default',
      theme: 'light'
    }
  },
  {
    type: 'line',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        label: 'Revenue',
        data: [1200, 1500, 1800, 2100],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Line Chart Test' },
        legend: { display: true, position: 'top' as const }
      }
    },
    customization: {
      colors: {
        primary: '#5470c6',
        secondary: '#91cc75',
        accent: '#fac858',
        background: '#ffffff',
        text: '#333333'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: { title: 18, labels: 12, legend: 14 }
      },
      layout: {
        padding: { top: 20, right: 20, bottom: 20, left: 20 }
      },
      animations: { enabled: true, duration: 1000, easing: 'cubicOut' },
      responsive: { enabled: true, breakpoints: { mobile: 480, tablet: 768, desktop: 1024 } },
      colorPalette: 'default',
      theme: 'light'
    }
  },
  {
    type: 'area',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Users',
        data: [100, 150, 200, 280],
        backgroundColor: 'rgba(139, 92, 246, 0.3)',
        borderColor: '#8b5cf6'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Area Chart Test' },
        legend: { display: true, position: 'top' as const }
      }
    },
    customization: {
      colors: {
        primary: '#5470c6',
        secondary: '#91cc75',
        accent: '#fac858',
        background: '#ffffff',
        text: '#333333'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: { title: 18, labels: 12, legend: 14 }
      },
      layout: {
        padding: { top: 20, right: 20, bottom: 20, left: 20 }
      },
      animations: { enabled: true, duration: 1000, easing: 'cubicOut' },
      responsive: { enabled: true, breakpoints: { mobile: 480, tablet: 768, desktop: 1024 } },
      colorPalette: 'default',
      theme: 'light'
    }
  },
  {
    type: 'pie',
    data: {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{
        label: 'Device Usage',
        data: [60, 30, 10],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Pie Chart Test' },
        legend: { display: true, position: 'bottom' as const }
      }
    },
    customization: {
      colors: {
        primary: '#5470c6',
        secondary: '#91cc75',
        accent: '#fac858',
        background: '#ffffff',
        text: '#333333'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: { title: 18, labels: 12, legend: 14 }
      },
      layout: {
        padding: { top: 20, right: 20, bottom: 20, left: 20 }
      },
      animations: { enabled: true, duration: 1000, easing: 'cubicOut' },
      responsive: { enabled: true, breakpoints: { mobile: 480, tablet: 768, desktop: 1024 } },
      colorPalette: 'default',
      theme: 'light'
    }
  },
  {
    type: 'doughnut',
    data: {
      labels: ['North', 'South', 'East', 'West'],
      datasets: [{
        label: 'Regional Sales',
        data: [25, 35, 20, 20],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Donut Chart Test' },
        legend: { display: true, position: 'bottom' as const }
      }
    },
    customization: {
      colors: {
        primary: '#5470c6',
        secondary: '#91cc75',
        accent: '#fac858',
        background: '#ffffff',
        text: '#333333'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: { title: 18, labels: 12, legend: 14 }
      },
      layout: {
        padding: { top: 20, right: 20, bottom: 20, left: 20 }
      },
      animations: { enabled: true, duration: 1000, easing: 'cubicOut' },
      responsive: { enabled: true, breakpoints: { mobile: 480, tablet: 768, desktop: 1024 } },
      colorPalette: 'default',
      theme: 'light'
    }
  },
  {
    type: 'scatter',
    data: {
      labels: ['Data Points'],
      datasets: [{
        label: 'Scatter Data',
        data: [
          { x: 10, y: 20 },
          { x: 15, y: 25 },
          { x: 20, y: 30 },
          { x: 25, y: 35 },
          { x: 30, y: 40 }
        ],
        backgroundColor: '#8b5cf6'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Scatter Chart Test' },
        legend: { display: true, position: 'top' as const }
      }
    },
    customization: {
      colors: {
        primary: '#5470c6',
        secondary: '#91cc75',
        accent: '#fac858',
        background: '#ffffff',
        text: '#333333'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: { title: 18, labels: 12, legend: 14 }
      },
      layout: {
        padding: { top: 20, right: 20, bottom: 20, left: 20 }
      },
      animations: { enabled: true, duration: 1000, easing: 'cubicOut' },
      responsive: { enabled: true, breakpoints: { mobile: 480, tablet: 768, desktop: 1024 } },
      colorPalette: 'default',
      theme: 'light'
    }
  }
]

interface ChartTestSuiteProps {
  onNavigate?: (page: 'landing' | 'pricing' | 'settings' | 'test-charts' | 'echarts-demo' | 'responsive-test') => void
}

export const ChartTestSuite: React.FC<ChartTestSuiteProps> = ({ onNavigate }) => {
  const [selectedChart, setSelectedChart] = useState(0)
  const [config, setConfig] = useState<ChartConfig>(TEST_CHARTS[0])

  const selectChart = (index: number) => {
    setSelectedChart(index)
    setConfig(TEST_CHARTS[index])
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">Chart Test Suite</h1>
            <p className="text-gray-400">Testing all ECharts chart types with proper colors and customization</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate?.('responsive-test')}
              className="bg-[#2563eb] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              📱 Responsive Test
            </button>
            <button
              onClick={() => onNavigate?.('landing')}
              className="bg-[#3a3a3a] text-white px-4 py-2 rounded-lg hover:bg-[#4a4a4a] transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Select Chart Type</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {TEST_CHARTS.map((chart, index) => (
              <button
                key={index}
                onClick={() => selectChart(index)}
                className={`p-4 rounded-lg border-2 transition-all text-center ${
                  selectedChart === index
                    ? 'border-[#cc785c] bg-[#cc785c]/20 text-[#f5f5f5]'
                    : 'border-[#3a3a3a] bg-[#2a2a2a] text-[#a3a3a3] hover:border-[#cc785c]/50'
                }`}
              >
                <div className="text-lg mb-1">
                  {chart.type === 'bar' && '📊'}
                  {chart.type === 'line' && '📈'}
                  {chart.type === 'area' && '🏔️'}
                  {chart.type === 'pie' && '🥧'}
                  {chart.type === 'doughnut' && '🍩'}
                  {chart.type === 'scatter' && '⚫'}
                </div>
                <div className="text-xs font-medium capitalize">{chart.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Chart Display */}
          <div className="bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-4 md:p-6 min-w-0">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
              {config.options.plugins?.title?.text || 'Chart'}
            </h3>
            <div className="w-full h-[500px]">
              <ChartRenderer
                config={config}
                className="w-full h-full"
                width={800}
                height={500}
                showControls={true}
              />
            </div>
            
            {/* Chart Info */}
            <div className="mt-4 p-4 bg-[#1a1a1a] rounded-lg border border-[#3a3a3a]">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#a3a3a3]">Type:</span>
                  <span className="text-[#f5f5f5] ml-2 capitalize">{config.type}</span>
                </div>
                <div>
                  <span className="text-[#a3a3a3]">Data Points:</span>
                  <span className="text-[#f5f5f5] ml-2">{config.data.datasets[0].data.length}</span>
                </div>
                <div>
                  <span className="text-[#a3a3a3]">Series:</span>
                  <span className="text-[#f5f5f5] ml-2">{config.data.datasets.length}</span>
                </div>
                <div>
                  <span className="text-[#a3a3a3]">Colors:</span>
                  <span className="text-[#f5f5f5] ml-2">
                    {Array.isArray(config.data.datasets[0].backgroundColor) 
                      ? config.data.datasets[0].backgroundColor.length 
                      : 1}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customization Panel */}
          <div>
            <EChartsCustomizationPanel
              config={config}
              onConfigChange={setConfig}
              onExport={(format) => {
                console.log(`Exporting as ${format}`)
                // Export functionality would go here
              }}
            />
          </div>
        </div>

        {/* Color Test */}
        <div className="mt-8 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-6">
          <h3 className="text-xl font-semibold text-white mb-4">ECharts Color Palettes</h3>
          <div className="grid grid-cols-8 gap-2">
            {ECHARTS_COLOR_PALETTES.default.map((color, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-12 h-12 rounded-lg mx-auto mb-2"
                  style={{ backgroundColor: color }}
                />
                <div className="text-xs text-[#a3a3a3]">Color {index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartTestSuite