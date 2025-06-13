import React, { useState } from 'react'
import EChartsRenderer from './EChartsRenderer'
import { ChartConfig } from '@/types/chart'

const RESPONSIVE_TEST_CHART: ChartConfig = {
  type: 'bar',
  data: {
    labels: ['Mobile', 'Tablet', 'Desktop', 'Large Screen'],
    datasets: [{
      label: 'Responsive Test',
      data: [320, 768, 1024, 1920],
      backgroundColor: ['#5470c6', '#91cc75', '#fac858', '#ee6666']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Responsive Chart Test' },
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
}

interface ResponsiveTestProps {
  onNavigate?: (page: 'landing' | 'pricing' | 'settings' | 'test-charts' | 'echarts-demo') => void
}

export const ResponsiveTest: React.FC<ResponsiveTestProps> = ({ onNavigate }) => {
  const [containerWidth, setContainerWidth] = useState('100%')

  const testSizes = [
    { label: 'Mobile (320px)', width: '320px' },
    { label: 'Tablet (768px)', width: '768px' },
    { label: 'Desktop (1024px)', width: '1024px' },
    { label: 'Full Width', width: '100%' }
  ]

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">Chart Responsiveness Test</h1>
            <p className="text-gray-400">Test how charts adapt to different container sizes</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate?.('test-charts')}
              className="bg-[#3a3a3a] text-white px-4 py-2 rounded-lg hover:bg-[#4a4a4a] transition-colors"
            >
              🧪 Test Suite
            </button>
            <button
              onClick={() => onNavigate?.('landing')}
              className="bg-[#3a3a3a] text-white px-4 py-2 rounded-lg hover:bg-[#4a4a4a] transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Size Controls */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Container Size</h2>
          <div className="flex flex-wrap gap-2">
            {testSizes.map((size) => (
              <button
                key={size.width}
                onClick={() => setContainerWidth(size.width)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  containerWidth === size.width
                    ? 'border-[#cc785c] bg-[#cc785c] text-white'
                    : 'border-[#3a3a3a] bg-[#2a2a2a] text-[#a3a3a3] hover:border-[#cc785c]/50'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white">
              Chart Container: {containerWidth}
            </h3>
            <p className="text-[#a3a3a3] text-sm">
              Resize the container to see how the chart adapts
            </p>
          </div>
          
          {/* Responsive Chart Container */}
          <div 
            className="mx-auto border border-[#4a4a4a] rounded-lg p-4"
            style={{ 
              width: containerWidth,
              maxWidth: '100%',
              height: '500px',
              transition: 'width 0.3s ease-in-out'
            }}
          >
            <div className="w-full h-full">
              <EChartsRenderer
                config={RESPONSIVE_TEST_CHART}
                className="w-full h-full"
                width="100%"
                height="100%"
                showControls={true}
                interactive={true}
                theme="light"
              />
            </div>
          </div>

          {/* Container Info */}
          <div className="mt-4 p-4 bg-[#1a1a1a] rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Container Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#a3a3a3]">
              <div>
                <span className="font-medium">Width:</span>
                <span className="ml-1">{containerWidth}</span>
              </div>
              <div>
                <span className="font-medium">Height:</span>
                <span className="ml-1">400px</span>
              </div>
              <div>
                <span className="font-medium">Responsive:</span>
                <span className="ml-1">Yes</span>
              </div>
              <div>
                <span className="font-medium">Chart Type:</span>
                <span className="ml-1">Bar Chart</span>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Breakpoints */}
        <div className="mt-8 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Responsive Breakpoints</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">📱 Mobile</h4>
              <p className="text-sm text-[#a3a3a3]">≤ 480px</p>
              <p className="text-xs text-[#666] mt-1">Optimized for small screens</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">💻 Tablet</h4>
              <p className="text-sm text-[#a3a3a3]">481px - 1024px</p>
              <p className="text-xs text-[#666] mt-1">Medium screen layouts</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">🖥️ Desktop</h4>
              <p className="text-sm text-[#a3a3a3]">≥ 1024px</p>
              <p className="text-xs text-[#666] mt-1">Full desktop experience</p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Responsive Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-white">✅ Implemented</h4>
              <ul className="text-sm text-[#a3a3a3] space-y-1">
                <li>• Automatic chart resizing</li>
                <li>• Container width adaptation</li>
                <li>• Responsive grid layouts</li>
                <li>• Mobile-optimized controls</li>
                <li>• Flexible height constraints</li>
                <li>• Window resize handling</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-white">🎯 Optimizations</h4>
              <ul className="text-sm text-[#a3a3a3] space-y-1">
                <li>• Canvas/SVG auto-sizing</li>
                <li>• ResizeObserver integration</li>
                <li>• Debounced resize events</li>
                <li>• Tailwind responsive classes</li>
                <li>• CSS container queries ready</li>
                <li>• Performance-optimized redraws</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResponsiveTest