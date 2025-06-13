import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ChartRenderer from '@/components/ChartRenderer'
import { ChartConfig } from '@/types/chart'
import { DEFAULT_CUSTOMIZATION } from '@/lib/chartCustomization'

// Mock Chart.js components to avoid canvas rendering in tests
vi.mock('react-chartjs-2', () => ({
  Bar: ({ data }: any) => <div data-testid="bar-chart">{JSON.stringify(data)}</div>,
  Line: ({ data }: any) => <div data-testid="line-chart">{JSON.stringify(data)}</div>,
  Pie: ({ data }: any) => <div data-testid="pie-chart">{JSON.stringify(data)}</div>,
  Doughnut: ({ data }: any) => <div data-testid="doughnut-chart">{JSON.stringify(data)}</div>,
  Scatter: ({ data }: any) => <div data-testid="scatter-chart">{JSON.stringify(data)}</div>,
  Radar: ({ data }: any) => <div data-testid="radar-chart">{JSON.stringify(data)}</div>,
  PolarArea: ({ data }: any) => <div data-testid="polar-area-chart">{JSON.stringify(data)}</div>
}))

// Mock Plotly for advanced chart types
vi.mock('react-plotly.js', () => ({
  default: ({ data }: any) => <div data-testid="plotly-chart">{JSON.stringify(data)}</div>
}))

const createMockChartConfig = (type: any): ChartConfig => ({
  type,
  data: {
    labels: ['Test 1', 'Test 2', 'Test 3'],
    datasets: [{
      label: 'Test Dataset',
      data: [10, 20, 30],
      backgroundColor: '#3b82f6'
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Test Chart' },
      legend: { position: 'top' as const }
    }
  },
  customization: DEFAULT_CUSTOMIZATION
})

describe('ChartRenderer', () => {
  describe('Chart.js chart types', () => {
    it('should render bar chart correctly', () => {
      const config = createMockChartConfig('bar')
      render(<ChartRenderer config={config} />)
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })

    it('should render line chart correctly', () => {
      const config = createMockChartConfig('line')
      render(<ChartRenderer config={config} />)
      
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })

    it('should render pie chart correctly', () => {
      const config = createMockChartConfig('pie')
      render(<ChartRenderer config={config} />)
      
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
    })

    it('should render doughnut chart correctly', () => {
      const config = createMockChartConfig('doughnut')
      render(<ChartRenderer config={config} />)
      
      expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument()
    })

    it('should render scatter chart correctly', () => {
      const config = createMockChartConfig('scatter')
      render(<ChartRenderer config={config} />)
      
      expect(screen.getByTestId('scatter-chart')).toBeInTheDocument()
    })

    it('should render radar chart correctly', () => {
      const config = createMockChartConfig('radar')
      render(<ChartRenderer config={config} />)
      
      expect(screen.getByTestId('radar-chart')).toBeInTheDocument()
    })

    it('should render polar area chart correctly', () => {
      const config = createMockChartConfig('polarArea')
      render(<ChartRenderer config={config} />)
      
      expect(screen.getByTestId('polar-area-chart')).toBeInTheDocument()
    })

    it('should render default bar chart for unknown type', () => {
      const config = createMockChartConfig('unknown-type')
      render(<ChartRenderer config={config} />)
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    })
  })

  describe('Plotly chart types', () => {
    it('should render heatmap using Plotly', () => {
      const config = createMockChartConfig('heatmap')
      render(<ChartRenderer config={config} />)
      
      expect(screen.getByTestId('plotly-chart')).toBeInTheDocument()
    })

    it('should render treemap using Plotly', () => {
      const config = createMockChartConfig('treemap')
      render(<ChartRenderer config={config} />)
      
      expect(screen.getByTestId('plotly-chart')).toBeInTheDocument()
    })

    it('should render sankey using Plotly', () => {
      const config = createMockChartConfig('sankey')
      render(<ChartRenderer config={config} />)
      
      expect(screen.getByTestId('plotly-chart')).toBeInTheDocument()
    })
  })

  describe('Chart configuration', () => {
    it('should apply correct dimensions', () => {
      const config = createMockChartConfig('bar')
      render(<ChartRenderer config={config} width={600} height={300} />)
      
      const container = document.querySelector('.chart-container')
      expect(container).toHaveStyle('width: 100%')
      expect(container).toHaveStyle('height: 400px')
    })

    it('should apply custom className', () => {
      const config = createMockChartConfig('line')
      render(<ChartRenderer config={config} className="custom-chart" />)
      
      const container = document.querySelector('.custom-chart')
      expect(container).toBeInTheDocument()
    })

    it('should show export controls when showControls is true', () => {
      const config = createMockChartConfig('pie')
      render(<ChartRenderer config={config} showControls={true} />)
      
      expect(screen.getByText('Export PNG')).toBeInTheDocument()
      expect(screen.getByText('Export JPG')).toBeInTheDocument()
      expect(screen.getByText('Export SVG')).toBeInTheDocument()
    })

    it('should not show export controls by default', () => {
      const config = createMockChartConfig('pie')
      render(<ChartRenderer config={config} />)
      
      expect(screen.queryByText('Export PNG')).not.toBeInTheDocument()
      expect(screen.queryByText('Export JPG')).not.toBeInTheDocument()
      expect(screen.queryByText('Export SVG')).not.toBeInTheDocument()
    })
  })

  describe('Data validation', () => {
    it('should handle empty data gracefully', () => {
      const config: ChartConfig = {
        type: 'bar',
        data: {
          labels: [],
          datasets: []
        },
        options: {},
        customization: DEFAULT_CUSTOMIZATION
      }
      
      expect(() => render(<ChartRenderer config={config} />)).not.toThrow()
    })

    it('should handle missing customization', () => {
      const config: ChartConfig = {
        type: 'line',
        data: {
          labels: ['A', 'B', 'C'],
          datasets: [{ label: 'Test', data: [1, 2, 3] }]
        },
        options: {},
        customization: DEFAULT_CUSTOMIZATION
      }
      
      expect(() => render(<ChartRenderer config={config} />)).not.toThrow()
    })
  })
})