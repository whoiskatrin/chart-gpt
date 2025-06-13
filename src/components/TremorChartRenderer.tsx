import React, { useState, useEffect } from 'react'
import { 
  AreaChart, 
  BarChart, 
  LineChart, 
  DonutChart, 
  ScatterChart,
  Card,
  Title,
  Subtitle,
  Legend,
  Text
} from '@tremor/react'
import { ChartConfig } from '@/types/chart'
import { TremorDataTransformer, TremorChartConfig, TremorDataPoint } from '@/lib/tremorDataTransforms'

interface TremorChartRendererProps {
  config: ChartConfig
  className?: string
  showTitle?: boolean
  showLegend?: boolean
  onDataPointClick?: (dataPoint: any) => void
  height?: string | number
  width?: string | number
}

export const TremorChartRenderer: React.FC<TremorChartRendererProps> = ({
  config,
  className = '',
  showTitle = true,
  showLegend = true,
  onDataPointClick,
  height = 400,
  width = '100%'
}) => {
  const [tremorConfig, setTremorConfig] = useState<TremorChartConfig | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null)

  useEffect(() => {
    try {
      const transformed = TremorDataTransformer.transformData(config)
      setTremorConfig(transformed)
      setError(null)
    } catch (err) {
      console.error('Error transforming data for Tremor:', err)
      setError(`Failed to transform data: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }, [config])

  const handleValueChange = (dataPoint: any) => {
    setSelectedDataPoint(dataPoint)
    onDataPointClick?.(dataPoint)
  }

  const renderChart = () => {
    if (!tremorConfig) return null

    const commonProps = {
      data: tremorConfig.data,
      categories: tremorConfig.categories,
      index: tremorConfig.index,
      colors: tremorConfig.colors,
      valueFormatter: tremorConfig.valueFormatter,
      showLegend: showLegend && tremorConfig.showLegend,
      showTooltip: tremorConfig.showTooltip,
      showGridLines: tremorConfig.showGridLines,
      onValueChange: handleValueChange,
      className: "mt-4"
    }

    switch (tremorConfig.type) {
      case 'AreaChart':
        return (
          <AreaChart
            {...commonProps}
            stack={tremorConfig.stack}
            relative={tremorConfig.relative}
            connectNulls={true}
            curveType="linear"
          />
        )

      case 'BarChart':
        return (
          <BarChart
            {...commonProps}
            stack={tremorConfig.stack}
            relative={tremorConfig.relative}
            layout={tremorConfig.data.length > 10 ? 'vertical' : 'horizontal'}
          />
        )

      case 'LineChart':
        return (
          <LineChart
            {...commonProps}
            connectNulls={true}
            curveType="linear"
          />
        )

      case 'DonutChart':
        return (
          <DonutChart
            data={tremorConfig.data}
            category="value"
            index="name"
            colors={tremorConfig.colors}
            valueFormatter={tremorConfig.valueFormatter}
            onValueChange={handleValueChange}
            className="mt-4"
            showLabel={true}
            showTooltip={tremorConfig.showTooltip}
          />
        )

      case 'ScatterChart':
        return (
          <ScatterChart
            {...commonProps}
            x="x"
            y="y"
            category="series"
            size="value"
            showOpacity={true}
          />
        )

      case 'ComposedChart':
        // For composed charts, we can render multiple chart types
        return (
          <div className="space-y-4">
            <AreaChart {...commonProps} />
            <BarChart {...commonProps} />
          </div>
        )

      default:
        return <BarChart {...commonProps} />
    }
  }

  const getTitle = () => {
    return config.options.plugins?.title?.text || 'Chart'
  }

  const getSubtitle = () => {
    if (selectedDataPoint) {
      const keys = Object.keys(selectedDataPoint).filter(key => 
        key !== tremorConfig?.index && typeof selectedDataPoint[key] === 'number'
      )
      
      if (keys.length > 0) {
        return `Selected: ${selectedDataPoint[tremorConfig?.index || 'name']} - ${keys.map(key => 
          `${key}: ${tremorConfig?.valueFormatter?.(selectedDataPoint[key]) || selectedDataPoint[key]}`
        ).join(', ')}`
      }
    }
    
    return `Interactive ${tremorConfig?.type.replace('Chart', '')} Chart`
  }

  if (error) {
    return (
      <Card className={`p-6 ${className}`} style={{ height, width }}>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <Title className="text-red-600 mb-2">Chart Error</Title>
          <Text className="text-red-500">{error}</Text>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </Card>
    )
  }

  if (!tremorConfig) {
    return (
      <Card className={`p-6 ${className}`} style={{ height, width }}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <Text className="ml-3">Loading chart...</Text>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 ${className}`} style={{ height, width }}>
      {showTitle && (
        <div className="mb-4">
          <Title className="text-lg font-semibold text-gray-900">
            {getTitle()}
          </Title>
          <Subtitle className="text-sm text-gray-600 mt-1">
            {getSubtitle()}
          </Subtitle>
        </div>
      )}
      
      {renderChart()}
      
      {/* Data Summary */}
      {tremorConfig.data.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <Text className="text-xs text-gray-600">
            Showing {tremorConfig.data.length} data points across {tremorConfig.categories.length} categories
          </Text>
          {selectedDataPoint && (
            <Text className="text-xs text-blue-600 mt-1">
              Click on chart elements to explore data interactively
            </Text>
          )}
        </div>
      )}
    </Card>
  )
}

// Flexible chart component that can auto-detect chart type from data
export const FlexibleTremorChart: React.FC<{
  data: any
  title?: string
  preferredType?: string
  className?: string
  height?: string | number
}> = ({ data, title, preferredType, className, height }) => {
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null)

  useEffect(() => {
    try {
      // Auto-detect chart type if not specified
      let chartType = preferredType || autoDetectChartType(data)
      
      // Use the flexible data adapter
      const config = TremorDataTransformer.adaptDataFormat(data, chartType)
      
      // Override title if provided
      if (title) {
        config.options.plugins = {
          ...config.options.plugins,
          title: { display: true, text: title }
        }
      }
      
      setChartConfig(config)
    } catch (error) {
      console.error('Error creating flexible chart:', error)
    }
  }, [data, title, preferredType])

  if (!chartConfig) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <TremorChartRenderer 
      config={chartConfig}
      className={className}
      height={height}
    />
  )
}

// Auto-detect optimal chart type based on data characteristics
function autoDetectChartType(data: any): string {
  if (!data || !Array.isArray(data)) return 'bar'
  
  const firstItem = data[0]
  if (!firstItem || typeof firstItem !== 'object') return 'bar'
  
  const keys = Object.keys(firstItem)
  const numericKeys = keys.filter(key => typeof firstItem[key] === 'number')
  
  // Single numeric value -> pie chart
  if (numericKeys.length === 1) {
    return 'pie'
  }
  
  // Multiple numeric values -> bar chart
  if (numericKeys.length > 1) {
    // Check if data looks time-based
    const firstKey = keys[0]
    const hasTimePattern = data.some((item: any) => {
      const value = item[firstKey]
      return typeof value === 'string' && 
             (value.includes('-') || value.includes('/') || value.includes('Q') || 
              value.match(/\d{4}/) || value.includes('Jan') || value.includes('Month'))
    })
    
    return hasTimePattern ? 'line' : 'bar'
  }
  
  return 'bar'
}

export default TremorChartRenderer