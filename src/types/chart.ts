export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'doughnut' 
  | 'scatter' 
  | 'area' 
  | 'bubble' 
  | 'radar' 
  | 'polarArea'
  | 'histogram'
  | 'heatmap'
  | 'treemap'
  | 'sankey'
  | 'funnel'
  | 'composed'
  | 'tracker'
  | 'gauge'
  | 'sunburst'
  | 'graph'
  | 'tree'

export interface DataPoint {
  x?: number | string
  y?: number | string
  value?: number
  label?: string
  [key: string]: any
}

export interface Dataset {
  label: string
  data: (number | DataPoint)[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean
  tension?: number
  pointRadius?: number
  pointHoverRadius?: number
  [key: string]: any
}

export interface ChartData {
  labels?: string[]
  datasets: Dataset[]
}

export interface ChartAnnotation {
  type: 'line' | 'box' | 'point' | 'ellipse'
  value?: number | string
  endValue?: number | string
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  label?: {
    content: string
    enabled: boolean
    position?: string
  }
}

export interface ChartCustomization {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      title: number
      labels: number
      legend: number
    }
  }
  layout: {
    padding: {
      top: number
      right: number
      bottom: number
      left: number
    }
  }
  animations: {
    enabled: boolean
    duration: number
    easing: string
  }
  responsive: {
    enabled: boolean
    breakpoints: {
      mobile: number
      tablet: number
      desktop: number
    }
  }
  // ECharts-specific properties
  colorPalette?: string
  theme?: string
  stacked?: boolean
  dataLabels?: {
    enabled: boolean
  }
  curves?: {
    enabled: boolean
  }
  line?: {
    width: number
  }
  symbolSize?: number
  borderRadius?: number
  [key: string]: any
}

export interface ChartOptions {
  responsive?: boolean
  maintainAspectRatio?: boolean
  aspectRatio?: number
  plugins?: {
    title?: {
      display: boolean
      text: string
      font?: {
        size: number
        family: string
        weight: string
      }
      color?: string
    }
    legend?: {
      display: boolean
      position: 'top' | 'bottom' | 'left' | 'right'
      labels?: {
        color?: string
        font?: {
          size: number
          family: string
        }
      }
    }
    tooltip?: {
      enabled: boolean
      backgroundColor?: string
      titleColor?: string
      bodyColor?: string
      borderColor?: string
      borderWidth?: number
    }
    annotation?: {
      annotations: ChartAnnotation[]
    }
  }
  scales?: {
    x?: {
      display: boolean
      title?: {
        display: boolean
        text: string
      }
      grid?: {
        display: boolean
        color?: string
      }
      ticks?: {
        color?: string
        font?: {
          size: number
        }
      }
    }
    y?: {
      display: boolean
      title?: {
        display: boolean
        text: string
      }
      grid?: {
        display: boolean
        color?: string
      }
      ticks?: {
        color?: string
        font?: {
          size: number
        }
      }
      beginAtZero?: boolean
    }
  }
  interaction?: {
    intersect: boolean
    mode: 'point' | 'nearest' | 'index' | 'dataset' | 'x' | 'y'
  }
}

export interface ChartConfig {
  type: ChartType
  data: ChartData
  options: ChartOptions
  customization: ChartCustomization
}

export interface ChartExportOptions {
  format: 'png' | 'jpg' | 'svg' | 'pdf'
  width: number
  height: number
  quality?: number
  backgroundColor?: string
}

export interface GeneratedChart {
  id: string
  config: ChartConfig
  prompt: string
  modelUsed: string
  timestamp: Date
  exportOptions?: ChartExportOptions
}