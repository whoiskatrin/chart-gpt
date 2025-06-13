import { ChartConfig, ChartData, Dataset } from '@/types/chart'

// Tremor chart types mapping
export type TremorChartType = 
  | 'AreaChart'
  | 'BarChart' 
  | 'LineChart'
  | 'DonutChart'
  | 'ScatterChart'

// Universal data structure for Tremor charts
export interface TremorDataPoint {
  [key: string]: string | number | undefined
}

// Configuration for Tremor charts
export interface TremorChartConfig {
  type: TremorChartType
  data: TremorDataPoint[]
  categories: string[]
  index: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  showLegend?: boolean
  showTooltip?: boolean
  showGridLines?: boolean
  stack?: boolean
  relative?: boolean
  onValueChange?: (value: any) => void
}

/**
 * Universal data transformer that converts our ChartConfig to Tremor-compatible format
 */
export class TremorDataTransformer {
  
  /**
   * Maps our chart types to Tremor chart types
   */
  static mapChartType(type: string): TremorChartType {
    const typeMap: Record<string, TremorChartType> = {
      'bar': 'BarChart',
      'line': 'LineChart',
      'area': 'AreaChart',
      'pie': 'DonutChart',
      'doughnut': 'DonutChart',
      'scatter': 'ScatterChart'
    }
    
    return typeMap[type] || 'BarChart'
  }

  /**
   * Transforms Chart.js/generic data format to Tremor format
   * This is the core function that makes data flexible across all chart types
   */
  static transformData(config: ChartConfig): TremorChartConfig {
    const { type, data, options, customization } = config
    const tremorType = this.mapChartType(type)
    
    console.log('🔄 Transforming data:', { type, tremorType, data })
    
    // Extract labels and datasets
    const labels = data.labels || []
    const datasets = data.datasets || []
    
    // Validate we have data
    if (datasets.length === 0) {
      console.error('❌ No datasets provided')
      throw new Error('No datasets provided')
    }

    const firstDataset = datasets[0]
    if (!firstDataset.data || firstDataset.data.length === 0) {
      console.error('❌ No data in first dataset')
      throw new Error('No data in first dataset')
    }

    console.log('📊 Processing datasets:', datasets.length)
    console.log('🏷️ Labels:', labels)
    
    // Ensure we have labels that match data length
    const dataLength = Math.max(...datasets.map(d => d.data.length))
    const finalLabels = labels.length >= dataLength ? labels : 
      Array.from({ length: dataLength }, (_, i) => labels[i] || `Item ${i + 1}`)
    
    console.log('🏷️ Final labels:', finalLabels)
    
    // Transform data based on chart type
    let transformedData: TremorDataPoint[]
    let categories: string[]
    let index: string
    
    if (this.isPieType(tremorType)) {
      // For pie/donut charts - simple label/value format
      ({ data: transformedData, categories, index } = this.transformPieData(finalLabels, datasets))
    } else {
      // For bar/line/area charts - time series or categorical format
      ({ data: transformedData, categories, index } = this.transformTimeSeriesData(finalLabels, datasets))
    }
    
    console.log('✅ Transformed data:', transformedData)
    console.log('📈 Categories:', categories)
    console.log('🗂️ Index:', index)
    
    // Extract colors from datasets or use defaults
    const colors = this.extractColors(datasets, customization.colors)
    
    const result = {
      type: tremorType,
      data: transformedData,
      categories,
      index,
      colors,
      valueFormatter: this.createValueFormatter(type),
      showLegend: options.plugins?.legend?.display ?? true,
      showTooltip: options.plugins?.tooltip?.enabled ?? true,
      showGridLines: options.scales?.x?.grid?.display ?? true,
      stack: this.shouldStack(type),
      relative: this.shouldUseRelative(type)
    }
    
    console.log('🎯 Final Tremor config:', result)
    return result
  }

  /**
   * Transform data for pie/donut charts
   */
  private static transformPieData(labels: string[], datasets: Dataset[]) {
    console.log('🥧 Transforming pie data')
    const dataset = datasets[0] // Pie charts typically use first dataset
    const data: TremorDataPoint[] = []
    
    labels.forEach((label, index) => {
      if (index < dataset.data.length) {
        const value = dataset.data[index]
        const numericValue = typeof value === 'number' ? value : 
                           (typeof value === 'object' && value && 'y' in value) ? (value as any).y : 0
        
        data.push({
          name: label,
          value: numericValue
        })
      }
    })
    
    console.log('🥧 Pie data result:', data)
    
    return {
      data,
      categories: ['value'] as string[],
      index: 'name' as string
    }
  }

  /**
   * Transform data for time series/categorical charts (bar, line, area)
   */
  private static transformTimeSeriesData(labels: string[], datasets: Dataset[]) {
    console.log('📊 Transforming time series data')
    const data: TremorDataPoint[] = []
    const categories = datasets.map(d => d.label || 'Series')
    
    console.log('📊 Categories from datasets:', categories)
    
    labels.forEach((label, index) => {
      const dataPoint: TremorDataPoint = {
        name: label,
        date: label // Tremor often uses 'date' as index even for non-time data
      }
      
      datasets.forEach(dataset => {
        if (index < dataset.data.length) {
          const value = dataset.data[index]
          const numericValue = typeof value === 'number' ? value : 
                             (typeof value === 'object' && value && 'y' in value) ? (value as any).y : 0
          
          const categoryName = dataset.label || 'Series'
          dataPoint[categoryName] = numericValue
        }
      })
      
      data.push(dataPoint)
    })
    
    console.log('📊 Time series data result:', data)
    
    return {
      data,
      categories,
      index: 'name' as string
    }
  }

  /**
   * Extract colors from datasets or use theme colors
   */
  private static extractColors(datasets: Dataset[], themeColors: any): string[] {
    console.log('🎨 Extracting colors from datasets:', datasets.length)
    console.log('🎨 Theme colors:', themeColors)
    
    const colors: string[] = []
    
    // Extract colors from datasets
    datasets.forEach((dataset, index) => {
      if (dataset.backgroundColor) {
        if (Array.isArray(dataset.backgroundColor)) {
          // For pie charts or multiple colors per dataset
          dataset.backgroundColor.forEach(color => {
            colors.push(this.hexToTremorColor(color))
          })
        } else {
          // Single color per dataset
          colors.push(this.hexToTremorColor(dataset.backgroundColor))
        }
      } else {
        // Fallback color if no backgroundColor
        const defaultColors = ['blue', 'emerald', 'violet', 'amber', 'rose', 'cyan', 'orange', 'lime']
        colors.push(defaultColors[index % defaultColors.length])
      }
    })
    
    // If still no colors, use bright default Tremor colors
    if (colors.length === 0) {
      colors.push(...['blue', 'emerald', 'violet', 'amber', 'rose', 'cyan'])
    }
    
    console.log('🎨 Final extracted colors:', colors)
    return colors
  }

  /**
   * Convert hex colors to Tremor color names (or return Tremor color if no match)
   */
  private static hexToTremorColor(hex: string): string {
    const colorMap: Record<string, string> = {
      '#3b82f6': 'blue',
      '#1d4ed8': 'blue',
      '#2563eb': 'blue',
      '#ef4444': 'red',
      '#dc2626': 'red', 
      '#b91c1c': 'red',
      '#10b981': 'emerald',
      '#059669': 'emerald',
      '#047857': 'emerald',
      '#22c55e': 'green',
      '#16a34a': 'green',
      '#15803d': 'green',
      '#f59e0b': 'amber',
      '#d97706': 'amber',
      '#b45309': 'amber',
      '#eab308': 'yellow',
      '#ca8a04': 'yellow',
      '#8b5cf6': 'violet',
      '#7c3aed': 'violet',
      '#6d28d9': 'violet',
      '#a855f7': 'purple',
      '#9333ea': 'purple',
      '#06b6d4': 'cyan',
      '#0891b2': 'cyan',
      '#0e7490': 'cyan',
      '#14b8a6': 'teal',
      '#0d9488': 'teal',
      '#ec4899': 'pink',
      '#db2777': 'pink',
      '#f43f5e': 'rose',
      '#e11d48': 'rose',
      '#84cc16': 'lime',
      '#65a30d': 'lime',
      '#f97316': 'orange',
      '#ea580c': 'orange',
      '#64748b': 'slate',
      '#475569': 'slate',
      '#6b7280': 'gray',
      '#4b5563': 'gray'
    }
    
    const normalized = hex.toLowerCase()
    const tremorColor = colorMap[normalized]
    
    if (tremorColor) {
      console.log(`🎨 Converted ${hex} to ${tremorColor}`)
      return tremorColor
    }
    
    // If no exact match, pick a bright default Tremor color
    const defaultColors = ['blue', 'emerald', 'violet', 'amber', 'rose', 'cyan']
    const fallback = defaultColors[Math.abs(hex.length) % defaultColors.length]
    console.log(`🎨 No match for ${hex}, using fallback: ${fallback}`)
    return fallback
  }

  /**
   * Create value formatter based on chart type
   */
  private static createValueFormatter(chartType: string) {
    return (value: number): string => {
      if (chartType.includes('percentage') || chartType === 'pie') {
        return `${value}%`
      }
      
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
      }
      
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`
      }
      
      return value.toLocaleString()
    }
  }

  /**
   * Determine if chart should be stacked
   */
  private static shouldStack(chartType: string): boolean {
    return chartType.includes('stack') || chartType === 'area'
  }

  /**
   * Determine if chart should use relative values
   */
  private static shouldUseRelative(chartType: string): boolean {
    return chartType.includes('percentage') || chartType.includes('relative')
  }

  /**
   * Check if chart type is pie-like
   */
  private static isPieType(tremorType: TremorChartType): boolean {
    return tremorType === 'DonutChart'
  }

  /**
   * Flexible data adapter - can handle various input formats
   */
  static adaptDataFormat(rawData: any, chartType: string): ChartConfig {
    console.log('🔄 Adapting data format:', { rawData, chartType })
    
    // Handle array of objects (most common format)
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
    
    // Fallback - return as-is if already in correct format
    return rawData as ChartConfig
  }

  /**
   * Adapt from array of objects
   */
  private static adaptFromObjectArray(data: any[], chartType: string): ChartConfig {
    const keys = Object.keys(data[0])
    const indexKey = keys[0] // First key as index
    const valueKeys = keys.slice(1) // Rest as values
    
    const labels = data.map(item => item[indexKey])
    const datasets = valueKeys.map(key => ({
      label: key,
      data: data.map(item => item[key] || 0),
      backgroundColor: this.getDefaultColor(key)
    }))
    
    return this.createChartConfig(chartType, labels, datasets)
  }

  /**
   * Adapt from number array
   */
  private static adaptFromNumberArray(data: number[], chartType: string): ChartConfig {
    const labels = data.map((_, index) => `Item ${index + 1}`)
    const datasets = [{
      label: 'Values',
      data,
      backgroundColor: '#3b82f6'
    }]
    
    return this.createChartConfig(chartType, labels, datasets)
  }

  /**
   * Adapt from CSV string
   */
  private static adaptFromCSV(csvData: string, chartType: string): ChartConfig {
    const lines = csvData.trim().split('\n')
    const headers = lines[0].split(',')
    const rows = lines.slice(1).map(line => line.split(','))
    
    const labels = rows.map(row => row[0])
    const datasets = headers.slice(1).map((header, index) => ({
      label: header.trim(),
      data: rows.map(row => parseFloat(row[index + 1]) || 0),
      backgroundColor: this.getDefaultColor(header)
    }))
    
    return this.createChartConfig(chartType, labels, datasets)
  }

  /**
   * Create a complete ChartConfig
   */
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
          primary: '#3b82f6',
          secondary: '#1e40af',
          accent: '#60a5fa',
          background: '#ffffff',
          text: '#1f2937'
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: { title: 18, labels: 12, legend: 14 }
        },
        layout: {
          padding: { top: 20, right: 20, bottom: 20, left: 20 }
        },
        animations: { enabled: true, duration: 1000, easing: 'easeInOutQuart' },
        responsive: { enabled: true, breakpoints: { mobile: 480, tablet: 768, desktop: 1024 } }
      }
    }
  }

  /**
   * Get default color for a dataset
   */
  private static getDefaultColor(key: string): string {
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
      '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ]
    
    const hash = key.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    return colors[Math.abs(hash) % colors.length]
  }
}

export default TremorDataTransformer