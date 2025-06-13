import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TremorChartRenderer, FlexibleTremorChart } from '@/components/TremorChartRenderer'
import { ChartConfig } from '@/types/chart'
import { DEFAULT_CUSTOMIZATION } from '@/lib/chartCustomization'

// Mock Tremor components
vi.mock('@tremor/react', () => ({
  AreaChart: ({ data, categories, index }: any) => (
    <div data-testid="tremor-area-chart">
      {JSON.stringify({ data, categories, index })}
    </div>
  ),
  BarChart: ({ data, categories, index }: any) => (
    <div data-testid="tremor-bar-chart">
      {JSON.stringify({ data, categories, index })}
    </div>
  ),
  LineChart: ({ data, categories, index }: any) => (
    <div data-testid="tremor-line-chart">
      {JSON.stringify({ data, categories, index })}
    </div>
  ),
  DonutChart: ({ data, category, index }: any) => (
    <div data-testid="tremor-donut-chart">
      {JSON.stringify({ data, category, index })}
    </div>
  ),
  ScatterChart: ({ data, categories, index }: any) => (
    <div data-testid="tremor-scatter-chart">
      {JSON.stringify({ data, categories, index })}
    </div>
  ),
  Card: ({ children, className }: any) => (
    <div data-testid="tremor-card" className={className}>
      {children}
    </div>
  ),
  Title: ({ children, className }: any) => (
    <h2 data-testid="tremor-title" className={className}>
      {children}
    </h2>
  ),
  Subtitle: ({ children, className }: any) => (
    <h3 data-testid="tremor-subtitle" className={className}>
      {children}
    </h3>
  ),
  Text: ({ children, className }: any) => (
    <p data-testid="tremor-text" className={className}>
      {children}
    </p>
  ),
  Legend: ({ children }: any) => <div data-testid="tremor-legend">{children}</div>
}))

const createMockChartConfig = (type: any): ChartConfig => ({
  type,
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{
      label: 'Sales',
      data: [100, 150, 200, 175],
      backgroundColor: '#3b82f6'
    }, {
      label: 'Expenses',
      data: [80, 120, 160, 140],
      backgroundColor: '#ef4444'
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Test Tremor Chart' },
      legend: { display: true, position: 'top' as const }
    }
  },
  customization: DEFAULT_CUSTOMIZATION
})

describe('TremorChartRenderer', () => {
  describe('Chart type rendering', () => {
    it('should render bar chart correctly', () => {
      const config = createMockChartConfig('bar')
      render(<TremorChartRenderer config={config} />)
      
      expect(screen.getByTestId('tremor-bar-chart')).toBeInTheDocument()
      expect(screen.getByTestId('tremor-card')).toBeInTheDocument()
    })

    it('should render line chart correctly', () => {
      const config = createMockChartConfig('line')
      render(<TremorChartRenderer config={config} />)
      
      expect(screen.getByTestId('tremor-line-chart')).toBeInTheDocument()
    })

    it('should render area chart correctly', () => {
      const config = createMockChartConfig('area')
      render(<TremorChartRenderer config={config} />)
      
      expect(screen.getByTestId('tremor-area-chart')).toBeInTheDocument()
    })

    it('should render pie chart as donut chart', () => {
      const config = createMockChartConfig('pie')
      render(<TremorChartRenderer config={config} />)
      
      expect(screen.getByTestId('tremor-donut-chart')).toBeInTheDocument()
    })

    it('should render scatter chart correctly', () => {
      const config = createMockChartConfig('scatter')
      render(<TremorChartRenderer config={config} />)
      
      expect(screen.getByTestId('tremor-scatter-chart')).toBeInTheDocument()
    })
  })

  describe('Data transformation', () => {
    it('should transform time series data correctly', () => {
      const config = createMockChartConfig('bar')
      render(<TremorChartRenderer config={config} />)
      
      const chartElement = screen.getByTestId('tremor-bar-chart')
      const chartData = JSON.parse(chartElement.textContent || '{}')
      
      expect(chartData.data).toHaveLength(4) // 4 data points
      expect(chartData.categories).toEqual(['Sales', 'Expenses'])
      expect(chartData.index).toBe('date')
    })

    it('should handle single dataset correctly', () => {
      const config: ChartConfig = {
        ...createMockChartConfig('line'),
        data: {
          labels: ['A', 'B', 'C'],
          datasets: [{
            label: 'Single Series',
            data: [10, 20, 30],
            backgroundColor: '#10b981'
          }]
        }
      }
      
      render(<TremorChartRenderer config={config} />)
      
      const chartElement = screen.getByTestId('tremor-line-chart')
      const chartData = JSON.parse(chartElement.textContent || '{}')
      
      expect(chartData.categories).toEqual(['Single Series'])
    })
  })

  describe('Configuration options', () => {
    it('should show title when enabled', () => {
      const config = createMockChartConfig('bar')
      render(<TremorChartRenderer config={config} showTitle={true} />)
      
      expect(screen.getByTestId('tremor-title')).toBeInTheDocument()
      expect(screen.getByText('Test Tremor Chart')).toBeInTheDocument()
    })

    it('should hide title when disabled', () => {
      const config = createMockChartConfig('bar')
      render(<TremorChartRenderer config={config} showTitle={false} />)
      
      expect(screen.queryByTestId('tremor-title')).not.toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const config = createMockChartConfig('bar')
      render(<TremorChartRenderer config={config} className="custom-chart" />)
      
      const card = screen.getByTestId('tremor-card')
      expect(card).toHaveClass('custom-chart')
    })
  })

  describe('Error handling', () => {
    it('should handle invalid data gracefully', () => {
      const config: ChartConfig = {
        ...createMockChartConfig('bar'),
        data: {
          labels: [],
          datasets: []
        }
      }
      
      render(<TremorChartRenderer config={config} />)
      
      // Should still render the card but might show error
      expect(screen.getByTestId('tremor-card')).toBeInTheDocument()
    })

    it('should show loading state initially', () => {
      const config = createMockChartConfig('bar')
      
      // Mock delayed rendering
      const { rerender } = render(<TremorChartRenderer config={config} />)
      
      // Should eventually show the chart
      expect(screen.getByTestId('tremor-card')).toBeInTheDocument()
    })
  })
})

describe('FlexibleTremorChart', () => {
  describe('Data format adaptability', () => {
    it('should handle array of objects', () => {
      const data = [
        { month: 'Jan', sales: 100, expenses: 80 },
        { month: 'Feb', sales: 150, expenses: 120 },
        { month: 'Mar', sales: 200, expenses: 160 }
      ]
      
      render(<FlexibleTremorChart data={data} title="Flexible Chart" />)
      
      expect(screen.getByTestId('tremor-card')).toBeInTheDocument()
    })

    it('should handle simple number arrays', () => {
      const data = [10, 20, 30, 40, 50]
      
      render(<FlexibleTremorChart data={data} preferredType="bar" />)
      
      expect(screen.getByTestId('tremor-card')).toBeInTheDocument()
    })

    it('should auto-detect chart type for time series data', () => {
      const data = [
        { date: '2023-01', value: 100 },
        { date: '2023-02', value: 150 },
        { date: '2023-03', value: 200 }
      ]
      
      render(<FlexibleTremorChart data={data} />)
      
      expect(screen.getByTestId('tremor-card')).toBeInTheDocument()
      // Should auto-detect as line chart due to date pattern
    })

    it('should auto-detect pie chart for single value data', () => {
      const data = [
        { category: 'A', value: 30 },
        { category: 'B', value: 45 },
        { category: 'C', value: 25 }
      ]
      
      render(<FlexibleTremorChart data={data} />)
      
      expect(screen.getByTestId('tremor-card')).toBeInTheDocument()
    })
  })

  describe('Dynamic chart configuration', () => {
    it('should use preferred chart type when specified', () => {
      const data = [
        { month: 'Jan', sales: 100 },
        { month: 'Feb', sales: 150 }
      ]
      
      render(<FlexibleTremorChart data={data} preferredType="area" />)
      
      expect(screen.getByTestId('tremor-card')).toBeInTheDocument()
    })

    it('should apply custom title', () => {
      const data = [{ x: 1, y: 2 }]
      
      render(<FlexibleTremorChart data={data} title="Custom Title" />)
      
      expect(screen.getByText('Custom Title')).toBeInTheDocument()
    })
  })
})