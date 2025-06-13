import { ChartConfig, ChartData, Dataset, ChartCustomization } from '@/types/chart'
import type { EChartsOption } from 'echarts'

// ECharts-specific types
export interface EChartsConfig {
  option: EChartsOption
  theme?: string
  renderer?: 'canvas' | 'svg'
  width?: number | string
  height?: number | string
  locale?: string
  devicePixelRatio?: number
}

// Enhanced color palettes for ECharts
export const ECHARTS_COLOR_PALETTES = {
  default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  business: ['#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074'],
  vibrant: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#ff6348'],
  cool: ['#667eea', '#764ba2', '#667eea', '#f093fb', '#667eea', '#84fab0', '#00d2ff', '#3a7bd5'],
  warm: ['#ff9a56', '#ff7f50', '#ffd700', '#ff6347', '#ffa500', '#ff4500', '#ff1493', '#ff69b4'],
  monochrome: ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7', '#ecf0f1', '#525252', '#737373'],
  ocean: ['#006994', '#13a8a8', '#52c41a', '#1890ff', '#722ed1', '#eb2f96', '#fa541c', '#fadb14'],
  sunset: ['#fa541c', '#fa8c16', '#faad14', '#fadb14', '#a0d911', '#52c41a', '#13c2c2', '#1890ff'],
  nature: ['#52c41a', '#73d13d', '#95de64', '#b7eb8f', '#389e0d', '#237804', '#135200', '#092b00'],
  tech: ['#1890ff', '#40a9ff', '#69c0ff', '#91d5ff', '#0050b3', '#003a8c', '#002766', '#001529']
}

/**
 * Universal data transformer for Apache ECharts
 * Converts various data formats to ECharts configuration
 */
export class EChartsDataTransformer {
  
  /**
   * Main transformation function from ChartConfig to ECharts configuration
   */
  static transformData(config: ChartConfig): EChartsConfig {
    const { type, data, options, customization } = config
    
    console.log('🎯 ECharts transforming data:', { type, data })
    
    // Generate ECharts option based on chart type
    let option: EChartsOption
    
    switch (type.toLowerCase()) {
      case 'bar':
        option = this.createBarChart(data, options, customization)
        break
      case 'line':
        option = this.createLineChart(data, options, customization)
        break
      case 'area':
        option = this.createAreaChart(data, options, customization)
        break
      case 'pie':
      case 'doughnut':
        option = this.createPieChart(data, options, customization, type === 'doughnut')
        break
      case 'scatter':
        option = this.createScatterChart(data, options, customization)
        break
      case 'radar':
        option = this.createRadarChart(data, options, customization)
        break
      case 'gauge':
        option = this.createGaugeChart(data, options, customization)
        break
      case 'funnel':
        option = this.createFunnelChart(data, options, customization)
        break
      case 'heatmap':
        option = this.createHeatmapChart(data, options, customization)
        break
      case 'treemap':
        option = this.createTreemapChart(data, options, customization)
        break
      case 'sunburst':
        option = this.createSunburstChart(data, options, customization)
        break
      case 'sankey':
        option = this.createSankeyChart(data, options, customization)
        break
      default:
        option = this.createBarChart(data, options, customization)
    }
    
    // Apply global styling and theme
    option = this.applyGlobalStyling(option, customization)
    
    console.log('✅ ECharts option generated:', option)
    
    return {
      option,
      theme: this.getTheme(customization),
      renderer: 'canvas',
      height: '400px'
    }
  }

  /**
   * Create bar chart configuration
   */
  private static createBarChart(data: ChartData, options: any, customization: ChartCustomization): EChartsOption {
    const series = data.datasets.map((dataset, index) => ({
      name: dataset.label || `Series ${index + 1}`,
      type: 'bar' as const,
      data: dataset.data,
      itemStyle: {
        color: this.getSeriesColor(dataset, index, customization),
        borderRadius: [(customization as any).borderRadius || 0, (customization as any).borderRadius || 0, 0, 0]
      },
      label: {
        show: (customization as any).dataLabels?.enabled || false,
        position: 'top',
        fontSize: customization.typography?.fontSize?.labels || 12,
        fontFamily: customization.typography?.fontFamily || 'Inter'
      },
      stack: (customization as any).stacked ? 'total' : undefined,
      emphasis: {
        focus: 'series'
      }
    }))

    return {
      title: {
        text: options?.plugins?.title?.text || 'Bar Chart',
        left: 'center',
        textStyle: {
          fontSize: customization.typography?.fontSize?.title || 18,
          fontFamily: customization.typography?.fontFamily || 'Inter'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        show: options?.plugins?.legend?.display !== false,
        top: '8%',
        left: 'center',
        data: data.datasets.map(d => d.label),
        orient: 'horizontal'
      },
      grid: {
        left: '8%',
        right: '8%',
        top: options?.plugins?.legend?.display !== false ? '25%' : '15%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.labels,
        name: options?.scales?.x?.title?.text || '',
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: options?.scales?.y?.title?.text || '',
        nameLocation: 'middle',
        nameGap: 50
      },
      series
    }
  }

  /**
   * Create line chart configuration
   */
  private static createLineChart(data: ChartData, options: any, customization: ChartCustomization): EChartsOption {
    const series = data.datasets.map((dataset, index) => ({
      name: dataset.label || `Series ${index + 1}`,
      type: 'line' as const,
      data: dataset.data,
      smooth: (customization as any).curves?.enabled || (customization as any).smooth || false,
      lineStyle: {
        color: this.getSeriesColor(dataset, index, customization),
        width: (customization as any).line?.width || 2
      },
      itemStyle: {
        color: this.getSeriesColor(dataset, index, customization),
        borderRadius: (customization as any).borderRadius || 0
      },
      areaStyle: dataset.fill ? {
        color: this.getSeriesColor(dataset, index, customization, 0.3)
      } : undefined,
      symbol: 'circle',
      symbolSize: (customization as any).symbolSize || 6,
      emphasis: {
        focus: 'series'
      }
    }))

    return {
      title: {
        text: options?.plugins?.title?.text || 'Line Chart',
        left: 'center',
        textStyle: {
          fontSize: customization.typography?.fontSize?.title || 18,
          fontFamily: customization.typography?.fontFamily || 'Inter'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        show: options?.plugins?.legend?.display !== false,
        top: '8%',
        left: 'center',
        data: data.datasets.map(d => d.label),
        orient: 'horizontal'
      },
      grid: {
        left: '8%',
        right: '8%',
        top: options?.plugins?.legend?.display !== false ? '25%' : '15%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.labels,
        name: options?.scales?.x?.title?.text || '',
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        name: options?.scales?.y?.title?.text || ''
      },
      series
    }
  }

  /**
   * Create area chart configuration
   */
  private static createAreaChart(data: ChartData, options: any, customization: ChartCustomization): EChartsOption {
    const series = data.datasets.map((dataset, index) => ({
      name: dataset.label || `Series ${index + 1}`,
      type: 'line' as const,
      data: dataset.data,
      smooth: (customization as any).smooth || true,
      areaStyle: {
        color: this.getSeriesColor(dataset, index, customization, 0.6)
      },
      lineStyle: {
        color: this.getSeriesColor(dataset, index, customization),
        width: (customization as any).line?.width || 2
      },
      itemStyle: {
        color: this.getSeriesColor(dataset, index, customization)
      },
      symbolSize: (customization as any).symbolSize || 6,
      stack: (customization as any).stacked ? 'area' : undefined,
      emphasis: {
        focus: 'series'
      }
    }))

    return {
      title: {
        text: options?.plugins?.title?.text || 'Area Chart',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        show: options?.plugins?.legend?.display !== false,
        top: '8%',
        left: 'center',
        data: data.datasets.map(d => d.label),
        orient: 'horizontal'
      },
      grid: {
        left: '8%',
        right: '8%',
        top: options?.plugins?.legend?.display !== false ? '25%' : '15%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.labels,
        boundaryGap: false
      },
      yAxis: {
        type: 'value'
      },
      series
    }
  }

  /**
   * Create pie/doughnut chart configuration
   */
  private static createPieChart(data: ChartData, options: any, customization: ChartCustomization, isDoughnut: boolean = false): EChartsOption {
    const dataset = data.datasets[0]
    const pieData = data.labels?.map((label, index) => ({
      name: label,
      value: dataset.data[index]
    })) || []

    return {
      title: {
        text: options?.plugins?.title?.text || (isDoughnut ? 'Doughnut Chart' : 'Pie Chart'),
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        show: options?.plugins?.legend?.display !== false,
        orient: 'horizontal',
        bottom: '8%',
        left: 'center',
        data: data.labels,
        itemGap: 15
      },
      series: [{
        name: dataset.label || 'Data',
        type: 'pie' as const,
        radius: isDoughnut ? ['30%', '60%'] : '60%',
        center: ['50%', '45%'],
        data: pieData,
        itemStyle: {
          borderRadius: customization.borderRadius || 0,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: customization.dataLabels?.enabled !== false,
          formatter: '{b}: {d}%'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
  }

  /**
   * Create scatter chart configuration
   */
  private static createScatterChart(data: ChartData, options: any, customization: ChartCustomization): EChartsOption {
    const series = data.datasets.map((dataset, index) => ({
      name: dataset.label || `Series ${index + 1}`,
      type: 'scatter' as const,
      data: dataset.data.map((point: any) => {
        if (typeof point === 'object' && point.x !== undefined && point.y !== undefined) {
          return [point.x, point.y]
        }
        return [index, point]
      }),
      itemStyle: {
        color: this.getSeriesColor(dataset, index, customization)
      },
      symbolSize: customization.symbolSize || 10,
      emphasis: {
        focus: 'series'
      }
    }))

    return {
      title: {
        text: options?.plugins?.title?.text || 'Scatter Chart',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        show: options?.plugins?.legend?.display !== false,
        top: 30,
        data: data.datasets.map(d => d.label)
      },
      xAxis: {
        type: 'value',
        scale: true,
        name: options?.scales?.x?.title?.text || 'X Axis'
      },
      yAxis: {
        type: 'value',
        scale: true,
        name: options?.scales?.y?.title?.text || 'Y Axis'
      },
      series
    }
  }

  /**
   * Create radar chart configuration
   */
  private static createRadarChart(data: ChartData, options: any, customization: ChartCustomization): EChartsOption {
    const indicator = data.labels?.map(label => ({ name: label, max: 100 })) || []
    
    const series = data.datasets.map((dataset, index) => ({
      name: dataset.label || `Series ${index + 1}`,
      type: 'radar' as const,
      data: [{
        value: dataset.data,
        name: dataset.label,
        itemStyle: {
          color: this.getSeriesColor(dataset, index, customization)
        },
        areaStyle: {
          color: this.getSeriesColor(dataset, index, customization, 0.3)
        }
      }]
    }))

    return {
      title: {
        text: options?.plugins?.title?.text || 'Radar Chart',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        show: options?.plugins?.legend?.display !== false,
        top: '8%',
        left: 'center',
        data: data.datasets.map(d => d.label),
        orient: 'horizontal'
      },
      radar: {
        indicator,
        radius: '55%',
        center: ['50%', '55%']
      },
      series
    }
  }

  /**
   * Create gauge chart configuration
   */
  private static createGaugeChart(data: ChartData, options: any, customization: ChartCustomization): EChartsOption {
    const value = typeof data.datasets[0].data[0] === 'number' ? data.datasets[0].data[0] : 0

    return {
      title: {
        text: options?.plugins?.title?.text || 'Gauge Chart',
        left: 'center'
      },
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
      },
      series: [{
        name: data.datasets[0].label || 'Value',
        type: 'gauge' as const,
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}%'
        },
        data: [{
          value,
          name: data.labels?.[0] || 'Progress'
        }]
      }]
    }
  }

  /**
   * Create funnel chart configuration
   */
  private static createFunnelChart(data: ChartData, options: any, customization: ChartCustomization): EChartsOption {
    const dataset = data.datasets[0]
    const funnelData = data.labels?.map((label, index) => ({
      name: label,
      value: dataset.data[index]
    })) || []

    return {
      title: {
        text: options?.plugins?.title?.text || 'Funnel Chart',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        show: options?.plugins?.legend?.display !== false,
        top: 30,
        data: data.labels
      },
      series: [{
        name: dataset.label || 'Funnel',
        type: 'funnel' as const,
        left: '10%',
        top: 60,
        width: '80%',
        height: '80%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        data: funnelData
      }]
    }
  }

  /**
   * Create heatmap chart configuration
   */
  private static createHeatmapChart(data: ChartData, options: any, customization: ChartCustomization): EChartsOption {
    // Transform data for heatmap format
    const heatmapData: any[] = []
    data.datasets.forEach((dataset, seriesIndex) => {
      dataset.data.forEach((value, dataIndex) => {
        heatmapData.push([dataIndex, seriesIndex, value])
      })
    })

    return {
      title: {
        text: options?.plugins?.title?.text || 'Heatmap Chart',
        left: 'center'
      },
      tooltip: {
        position: 'top'
      },
      grid: {
        height: '50%',
        top: '10%'
      },
      xAxis: {
        type: 'category',
        data: data.labels,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: data.datasets.map(d => d.label),
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: Math.max(...heatmapData.map(d => d[2])),
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
      },
      series: [{
        name: 'Heatmap',
        type: 'heatmap' as const,
        data: heatmapData,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
  }

  /**
   * Create treemap chart configuration
   */
  private static createTreemapChart(data: ChartData, options: any, customization: ChartCustomization): EChartsOption {
    const dataset = data.datasets[0]
    const treemapData = data.labels?.map((label, index) => ({
      name: label,
      value: dataset.data[index]
    })) || []

    return {
      title: {
        text: options?.plugins?.title?.text || 'Treemap Chart',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [{
        name: dataset.label || 'Treemap',
        type: 'treemap' as const,
        data: treemapData,
        label: {
          show: true,
          formatter: '{b}'
        },
        itemStyle: {
          borderColor: '#fff'
        }
      }]
    }
  }

  /**
   * Create sunburst chart configuration
   */
  private static createSunburstChart(data: ChartData, options: any, customization: ChartCustomization): EChartsOption {
    // Transform flat data to hierarchical structure
    const sunburstData = data.labels?.map((label, index) => ({
      name: label,
      value: data.datasets[0].data[index],
      children: []
    })) || []

    return {
      title: {
        text: options?.plugins?.title?.text || 'Sunburst Chart',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [{
        name: 'Sunburst',
        type: 'sunburst' as const,
        data: sunburstData,
        radius: [0, '90%'],
        label: {
          rotate: 'radial'
        }
      }]
    }
  }

  /**
   * Create sankey chart configuration
   */
  private static createSankeyChart(data: ChartData, options: any, customization: ChartCustomization): EChartsOption {
    // Basic sankey data structure
    const nodes = data.labels?.map(label => ({ name: label })) || []
    const links: any[] = []

    return {
      title: {
        text: options?.plugins?.title?.text || 'Sankey Chart',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'sankey' as const,
        data: nodes,
        links: links,
        emphasis: {
          focus: 'adjacency'
        },
        lineStyle: {
          color: 'gradient',
          curveness: 0.5
        }
      }]
    }
  }

  /**
   * Apply global styling to the chart option
   */
  private static applyGlobalStyling(option: EChartsOption, customization: ChartCustomization): EChartsOption {
    const styled = { ...option }

    // Apply theme-based background color
    const theme = (customization as any).theme || 'light'
    styled.backgroundColor = theme === 'light' ? '#ffffff' : 'transparent'
    
    // Apply color palette
    if (customization.colorPalette) {
      styled.color = ECHARTS_COLOR_PALETTES[customization.colorPalette] || ECHARTS_COLOR_PALETTES.default
    }

    // Apply theme-based text styles
    const textColor = theme === 'light' ? '#333333' : '#f5f5f5'
    const axisColor = theme === 'light' ? '#cccccc' : '#4a4a4a'
    const gridColor = theme === 'light' ? '#f0f0f0' : '#3a3a3a'
    
    if (styled.title) {
      styled.title = {
        ...styled.title,
        textStyle: {
          ...styled.title.textStyle,
          color: textColor,
          fontFamily: customization.typography?.fontFamily || 'Inter, system-ui, sans-serif',
          fontSize: customization.typography?.fontSize?.title || 18
        }
      }
    }

    // Apply theme-based legend styles
    if (styled.legend) {
      styled.legend = {
        ...styled.legend,
        textStyle: {
          color: textColor,
          fontFamily: customization.typography?.fontFamily || 'Inter, system-ui, sans-serif',
          fontSize: customization.typography?.fontSize?.legend || 14
        },
        itemGap: 20,
        itemWidth: 14,
        itemHeight: 14
      }
    }

    // Apply theme-based axis styles
    if (styled.xAxis) {
      const xAxisConfig = Array.isArray(styled.xAxis) ? styled.xAxis[0] : styled.xAxis
      styled.xAxis = {
        ...xAxisConfig,
        axisLine: {
          lineStyle: { color: axisColor }
        },
        axisTick: {
          lineStyle: { color: axisColor }
        },
        axisLabel: {
          color: theme === 'light' ? '#666666' : '#a3a3a3',
          fontFamily: customization.typography?.fontFamily || 'Inter, system-ui, sans-serif',
          fontSize: customization.typography?.fontSize?.labels || 12
        },
        splitLine: {
          lineStyle: { color: gridColor, type: 'dashed' }
        }
      }
    }

    if (styled.yAxis) {
      const yAxisConfig = Array.isArray(styled.yAxis) ? styled.yAxis[0] : styled.yAxis
      styled.yAxis = {
        ...yAxisConfig,
        axisLine: {
          lineStyle: { color: axisColor }
        },
        axisTick: {
          lineStyle: { color: axisColor }
        },
        axisLabel: {
          color: theme === 'light' ? '#666666' : '#a3a3a3',
          fontFamily: customization.typography?.fontFamily || 'Inter, system-ui, sans-serif',
          fontSize: customization.typography?.fontSize?.labels || 12
        },
        splitLine: {
          lineStyle: { color: gridColor, type: 'dashed' }
        }
      }
    }

    // Disable tooltips to prevent empty white blocks
    styled.tooltip = {
      show: false
    }

    // Apply animations
    if (customization.animations?.enabled !== false) {
      styled.animation = true
      styled.animationDuration = customization.animations?.duration || 1000
      styled.animationEasing = customization.animations?.easing || 'cubicOut'
    }

    return styled
  }

  /**
   * Get series color from dataset or fallback
   */
  private static getSeriesColor(dataset: Dataset, index: number, customization: ChartCustomization, alpha: number = 1): string {
    if (dataset.backgroundColor) {
      const color = Array.isArray(dataset.backgroundColor) 
        ? dataset.backgroundColor[0] 
        : dataset.backgroundColor
      
      if (alpha < 1 && typeof color === 'string' && color.startsWith('#')) {
        return this.hexToRgba(color, alpha)
      }
      return color
    }

    const palette = ECHARTS_COLOR_PALETTES[customization.colorPalette] || ECHARTS_COLOR_PALETTES.default
    const color = palette[index % palette.length]
    
    if (alpha < 1) {
      return this.hexToRgba(color, alpha)
    }
    
    return color
  }

  /**
   * Convert hex color to rgba with alpha
   */
  private static hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  /**
   * Get theme name for ECharts
   */
  private static getTheme(customization: ChartCustomization): string {
    return customization.theme || 'default'
  }

  /**
   * Flexible data adapter for various input formats
   */
  static adaptDataFormat(rawData: any, chartType: string): ChartConfig {
    console.log('🔄 ECharts adapting data format:', { rawData, chartType })
    
    // Handle array of objects
    if (Array.isArray(rawData) && rawData.length > 0 && typeof rawData[0] === 'object') {
      return this.adaptFromObjectArray(rawData, chartType)
    }
    
    // Handle simple arrays
    if (Array.isArray(rawData) && rawData.every(item => typeof item === 'number')) {
      return this.adaptFromNumberArray(rawData, chartType)
    }
    
    // Handle CSV-like data
    if (typeof rawData === 'string') {
      return this.adaptFromCSV(rawData, chartType)
    }
    
    // Return as-is if already in correct format
    return rawData as ChartConfig
  }

  private static adaptFromObjectArray(data: any[], chartType: string): ChartConfig {
    const keys = Object.keys(data[0])
    const indexKey = keys[0]
    const valueKeys = keys.slice(1)
    
    const labels = data.map(item => item[indexKey])
    const datasets = valueKeys.map((key, index) => ({
      label: key,
      data: data.map(item => item[key] || 0),
      backgroundColor: ECHARTS_COLOR_PALETTES.default[index % ECHARTS_COLOR_PALETTES.default.length]
    }))
    
    return this.createChartConfig(chartType, labels, datasets)
  }

  private static adaptFromNumberArray(data: number[], chartType: string): ChartConfig {
    const labels = data.map((_, index) => `Item ${index + 1}`)
    const datasets = [{
      label: 'Values',
      data,
      backgroundColor: ECHARTS_COLOR_PALETTES.default[0]
    }]
    
    return this.createChartConfig(chartType, labels, datasets)
  }

  private static adaptFromCSV(csvData: string, chartType: string): ChartConfig {
    const lines = csvData.trim().split('\n')
    const headers = lines[0].split(',')
    const rows = lines.slice(1).map(line => line.split(','))
    
    const labels = rows.map(row => row[0])
    const datasets = headers.slice(1).map((header, index) => ({
      label: header.trim(),
      data: rows.map(row => parseFloat(row[index + 1]) || 0),
      backgroundColor: ECHARTS_COLOR_PALETTES.default[index % ECHARTS_COLOR_PALETTES.default.length]
    }))
    
    return this.createChartConfig(chartType, labels, datasets)
  }

  private static createChartConfig(chartType: string, labels: string[], datasets: Dataset[]): ChartConfig {
    return {
      type: chartType as any,
      data: { labels, datasets },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Generated Chart' },
          legend: { display: true, position: 'top' as const }
        }
      },
      customization: {
        colors: {
          primary: ECHARTS_COLOR_PALETTES.default[0],
          secondary: ECHARTS_COLOR_PALETTES.default[1],
          accent: ECHARTS_COLOR_PALETTES.default[2],
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
  }
}

export default EChartsDataTransformer