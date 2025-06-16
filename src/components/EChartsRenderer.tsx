import React, { useState, useEffect, useRef, useCallback } from 'react'
import ReactECharts from 'echarts-for-react'
import { EChartsOption } from 'echarts'
import { ChartConfig, ChartExportOptions } from '@/types/chart'
import { EChartsDataTransformer, EChartsConfig } from '@/lib/echartsDataTransforms'
import { Download, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react'

interface EChartsRendererProps {
  config: ChartConfig
  width?: number | string
  height?: number | string
  className?: string
  onExport?: (options: ChartExportOptions) => void
  showControls?: boolean
  onDataPointClick?: (dataPoint: any) => void
  interactive?: boolean
  theme?: 'light' | 'dark' | 'auto'
}

export const EChartsRenderer: React.FC<EChartsRendererProps> = ({
  config,
  width = '100%',
  height = 400,
  className = '',
  onExport,
  showControls = false,
  onDataPointClick,
  interactive = true,
  theme = 'light'
}) => {
  const [echartsConfig, setEchartsConfig] = useState<EChartsConfig | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const chartRef = useRef<ReactECharts>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Resize observer to handle container size changes
  const handleResize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setContainerSize({ width: rect.width, height: rect.height })
      
      // Trigger chart resize
      const chartInstance = chartRef.current?.getEchartsInstance()
      if (chartInstance) {
        setTimeout(() => {
          chartInstance.resize()
        }, 100)
      }
    }
  }, [])

  // Set up resize observer
  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Also listen to window resize for good measure
    window.addEventListener('resize', handleResize)
    
    // Initial size calculation
    handleResize()

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  useEffect(() => {
    console.log('🎯 EChartsRenderer received config:', config)
    setIsLoading(true)
    
    try {
      const transformed = EChartsDataTransformer.transformData(config)
      console.log('✅ ECharts config generated:', transformed)
      
      // Add event handlers and responsive settings
      if (transformed.option && interactive) {
        transformed.option.tooltip = {
          ...transformed.option.tooltip,
          trigger: 'item'
        }
      }

      // Ensure the chart is responsive with proper spacing
      if (transformed.option && (config.type === 'bar' || config.type === 'line' || config.type === 'area' || config.type === 'scatter')) {
        transformed.option.grid = {
          ...transformed.option.grid,
          left: '8%',
          right: '8%',
          top: '12%',
          bottom: '12%',
          containLabel: true
        }
      }
      
      setEchartsConfig(transformed)
      setError(null)
    } catch (err) {
      console.error('❌ Error transforming data for ECharts:', err)
      setError(`Failed to transform data: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }, [config, interactive])

  const handleChartClick = (params: any) => {
    console.log('📊 Chart clicked:', params)
    setSelectedDataPoint(params)
    onDataPointClick?.(params)
  }

  const exportChart = async (format: ChartExportOptions['format']) => {
    try {
      const chartInstance = chartRef.current?.getEchartsInstance()
      if (!chartInstance) {
        throw new Error('Chart instance not available')
      }

      let dataUrl: string
      
      if (format === 'svg') {
        // For SVG, we need to render with SVG renderer
        dataUrl = chartInstance.renderToSVGString()
        const blob = new Blob([dataUrl], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.download = `chart.${format}`
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        // For PNG/JPG
        dataUrl = chartInstance.getDataURL({
          type: format === 'jpg' ? 'jpeg' : 'png',
          pixelRatio: 2,
          backgroundColor: config.customization?.colors?.background || '#ffffff'
        })
        
        const link = document.createElement('a')
        link.download = `chart.${format}`
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      const exportOptions: ChartExportOptions = {
        format,
        width: typeof width === 'number' ? width : 800,
        height: typeof height === 'number' ? height : 400,
        backgroundColor: config.customization?.colors?.background || '#ffffff'
      }
      
      onExport?.(exportOptions)
      console.log(`✅ Chart exported as ${format.toUpperCase()}`)
    } catch (error) {
      console.error('❌ Export failed:', error)
      setError(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const zoomIn = () => {
    const chartInstance = chartRef.current?.getEchartsInstance()
    if (chartInstance) {
      chartInstance.dispatchAction({
        type: 'dataZoom',
        start: 20,
        end: 80
      })
    }
  }

  const zoomOut = () => {
    const chartInstance = chartRef.current?.getEchartsInstance()
    if (chartInstance) {
      chartInstance.dispatchAction({
        type: 'dataZoom',
        start: 0,
        end: 100
      })
    }
  }

  const resetZoom = () => {
    const chartInstance = chartRef.current?.getEchartsInstance()
    if (chartInstance) {
      chartInstance.dispatchAction({
        type: 'restore'
      })
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const getTitle = () => {
    return config.options?.plugins?.title?.text || 'ECharts Visualization'
  }

  const getSubtitle = () => {
    if (selectedDataPoint) {
      const { name, value, seriesName } = selectedDataPoint
      return `Selected: ${name || seriesName || 'Data Point'} - Value: ${value || 'N/A'}`
    }
    
    return `Interactive ${config.type.charAt(0).toUpperCase() + config.type.slice(1)} Chart`
  }

  const getChartEvents = () => {
    return {
      click: handleChartClick,
      mouseover: (params: any) => {
        console.log('Chart hover:', params)
      },
      legendselectchanged: (params: any) => {
        console.log('Legend changed:', params)
      }
    }
  }

  if (error) {
    return (
      <div className={`${className} p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg`} style={{ height, width }}>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Chart Error</h3>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || !echartsConfig) {
    return (
      <div className={`${className} p-6`} style={{ height, width }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading chart...</p>
          </div>
        </div>
      </div>
    )
  }

  const getResponsiveHeight = () => {
    if (isFullscreen) return '90vh'
    if (typeof height === 'number') return `${height}px`
    return height
  }

  const getResponsiveWidth = () => {
    if (isFullscreen) return '100vw'
    return '100%' // Always use 100% for responsive behavior
  }

  return (
    <div 
      ref={containerRef}
      className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4' : 'relative w-full h-full'}`}
    >
      {/* Chart Controls - Compact header */}
      {showControls && (
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {getTitle()}
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={zoomIn}
              className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={zoomOut}
              className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <button
              onClick={resetZoom}
              className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
      
      {/* ECharts Component - Takes up most of the space */}
      <div 
        className="chart-container w-full flex-1" 
        style={{ 
          width: getResponsiveWidth(), 
          height: showControls ? 'calc(100% - 50px)' : '100%',
          minHeight: isFullscreen ? '80vh' : '350px'
        }}
      >
        <ReactECharts
          ref={chartRef}
          option={echartsConfig.option}
          style={{ width: '100%', height: '100%' }}
          theme={undefined}
          onEvents={interactive ? getChartEvents() : undefined}
          opts={{
            renderer: echartsConfig.renderer || 'canvas',
            devicePixelRatio: window.devicePixelRatio || 1
          }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>

      {/* Export Controls - Compact footer */}
      {showControls && (
        <div className="flex gap-1 justify-center mt-2">
          <button
            onClick={() => exportChart('png')}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            PNG
          </button>
          <button
            onClick={() => exportChart('jpg')}
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            JPG
          </button>
          <button
            onClick={() => exportChart('svg')}
            className="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            SVG
          </button>
        </div>
      )}

      {/* Fullscreen Close Button */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 z-10"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default EChartsRenderer