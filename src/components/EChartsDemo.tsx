import React, { useState } from 'react'
import EChartsRenderer from './EChartsRenderer'
import EChartsCustomizationPanel from './EChartsCustomizationPanel'
import { ChartConfig } from '@/types/chart'

const DEMO_CHARTS: ChartConfig[] = [
  {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue ($K)',
        data: [45, 52, 38, 61, 49, 67],
        backgroundColor: '#5470c6'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Monthly Revenue - Bar Chart' },
        legend: { display: true, position: 'top' }
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
      labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024'],
      datasets: [{
        label: 'Growth (%)',
        data: [12, 19, 25, 32, 38, 45],
        backgroundColor: '#91cc75',
        borderColor: '#91cc75'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Quarterly Growth - Line Chart' },
        legend: { display: true, position: 'top' }
      }
    },
    customization: {
      colors: {
        primary: '#91cc75',
        secondary: '#5470c6',
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
      labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
      datasets: [{
        label: 'Device Usage',
        data: [45, 35, 15, 5],
        backgroundColor: ['#5470c6', '#91cc75', '#fac858', '#ee6666']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Device Usage Distribution - Pie Chart' },
        legend: { display: true, position: 'bottom' }
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
    type: 'radar',
    data: {
      labels: ['Performance', 'Usability', 'Design', 'Features', 'Support', 'Value'],
      datasets: [{
        label: 'Product Rating',
        data: [85, 90, 88, 82, 87, 91],
        backgroundColor: '#fac858'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Product Rating - Radar Chart' },
        legend: { display: true, position: 'top' }
      }
    },
    customization: {
      colors: {
        primary: '#fac858',
        secondary: '#5470c6',
        accent: '#91cc75',
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

export const EChartsDemo: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState(0)
  const [config, setConfig] = useState<ChartConfig>(DEMO_CHARTS[0])

  const selectChart = (index: number) => {
    setSelectedChart(index)
    setConfig(DEMO_CHARTS[index])
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Apache ECharts Demo</h1>
          <p className="text-gray-400">Experience the power and flexibility of ECharts with comprehensive customization</p>
        </div>

        {/* Chart Type Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Select Chart Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DEMO_CHARTS.map((chart, index) => (
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
                  {chart.type === 'pie' && '🥧'}
                  {chart.type === 'radar' && '🕸️'}
                </div>
                <div className="text-xs font-medium capitalize">{chart.type} Chart</div>
                <div className="text-xs text-[#a3a3a3] mt-1">{chart.data.datasets[0].data.length} points</div>
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
              <EChartsRenderer
                config={config}
                className="w-full h-full"
                width="100%"
                height="100%"
                showControls={true}
                interactive={true}
                theme="light"
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
                  <span className="text-[#a3a3a3]">Palette:</span>
                  <span className="text-[#f5f5f5] ml-2">{config.customization.colorPalette}</span>
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
              }}
            />
          </div>
        </div>

        {/* Features Showcase */}
        <div className="mt-8 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-6">
          <h3 className="text-xl font-semibold text-white mb-4">ECharts Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
              <div className="text-3xl mb-2">🎨</div>
              <div className="font-medium text-white">Rich Customization</div>
              <div className="text-xs text-[#a3a3a3] mt-1">Colors, themes, styling</div>
            </div>
            <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
              <div className="text-3xl mb-2">📊</div>
              <div className="font-medium text-white">12+ Chart Types</div>
              <div className="text-xs text-[#a3a3a3] mt-1">Bar, line, pie, radar, gauge...</div>
            </div>
            <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-medium text-white">High Performance</div>
              <div className="text-xs text-[#a3a3a3] mt-1">Canvas & SVG rendering</div>
            </div>
            <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
              <div className="text-3xl mb-2">🖱️</div>
              <div className="font-medium text-white">Interactive</div>
              <div className="text-xs text-[#a3a3a3] mt-1">Zoom, brush, tooltip</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EChartsDemo