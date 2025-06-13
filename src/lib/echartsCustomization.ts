import { ChartConfig, ChartCustomization } from '@/types/chart'
import { ECHARTS_COLOR_PALETTES } from './echartsDataTransforms'

// Extended customization options specific to ECharts
export interface EChartsCustomization extends ChartCustomization {
  // Color settings
  colorPalette?: keyof typeof ECHARTS_COLOR_PALETTES
  gradients?: {
    enabled: boolean
    direction: 'horizontal' | 'vertical' | 'radial'
  }
  
  // Chart behavior
  brush?: {
    enabled: boolean
    toolbox: boolean
  }
  dataZoom?: {
    enabled: boolean
    type: 'slider' | 'inside' | 'both'
  }
  
  // Visual effects
  shadows?: {
    enabled: boolean
    blur: number
    color: string
    offsetX: number
    offsetY: number
  }
  borderRadius?: number
  
  // Interaction
  emphasis?: {
    focus: 'none' | 'self' | 'series' | 'adjacency'
    scale: number
  }
  
  // Grid and axes
  grid?: {
    show: boolean
    borderColor: string
    backgroundColor: string
  }
  axes?: {
    labelRotation: number
    labelInterval: number | 'auto'
    axisLine: boolean
    axisTick: boolean
    splitLine: boolean
  }
  
  // Advanced features
  toolbox?: {
    enabled: boolean
    features: string[]
  }
  markPoint?: {
    enabled: boolean
    type: 'max' | 'min' | 'average'
  }
  markLine?: {
    enabled: boolean
    type: 'max' | 'min' | 'average'
  }
  
  // 3D effects (for 3D charts)
  viewControl?: {
    autoRotate: boolean
    distance: number
    alpha: number
    beta: number
  }
  
  // Performance
  progressive?: {
    enabled: boolean
    threshold: number
  }
}

// Predefined themes for ECharts
export const ECHARTS_THEMES = {
  light: {
    backgroundColor: '#ffffff',
    textColor: '#333333',
    axisColor: '#cccccc',
    gridColor: '#f0f0f0'
  },
  dark: {
    backgroundColor: '#1e1e1e',
    textColor: '#ffffff',
    axisColor: '#444444',
    gridColor: '#333333'
  },
  business: {
    backgroundColor: '#f8f9fa',
    textColor: '#2c3e50',
    axisColor: '#bdc3c7',
    gridColor: '#ecf0f1'
  },
  vibrant: {
    backgroundColor: '#0f0f23',
    textColor: '#ffffff',
    axisColor: '#333366',
    gridColor: '#1a1a40'
  }
}

// Chart type specific configurations
export const ECHARTS_CHART_CONFIGS = {
  bar: {
    supportedFeatures: ['stack', 'brush', 'dataZoom', 'markPoint', 'markLine'],
    defaultBorderRadius: 4,
    defaultGap: '20%'
  },
  line: {
    supportedFeatures: ['smooth', 'area', 'dataZoom', 'markPoint', 'markLine'],
    defaultSymbolSize: 6,
    defaultLineWidth: 2
  },
  area: {
    supportedFeatures: ['stack', 'smooth', 'dataZoom', 'markPoint', 'markLine'],
    defaultOpacity: 0.6
  },
  pie: {
    supportedFeatures: ['emphasis', 'labelLine', 'rose'],
    defaultRadius: ['0%', '70%'],
    defaultRoseType: false
  },
  scatter: {
    supportedFeatures: ['brush', 'dataZoom', 'large'],
    defaultSymbolSize: 10,
    largeThreshold: 2000
  },
  radar: {
    supportedFeatures: ['areaStyle', 'symbol'],
    defaultRadius: '70%'
  },
  gauge: {
    supportedFeatures: ['progress', 'pointer', 'anchor'],
    defaultRadius: '75%'
  },
  funnel: {
    supportedFeatures: ['sort', 'gap', 'label'],
    defaultSort: 'descending',
    defaultGap: 2
  },
  heatmap: {
    supportedFeatures: ['visualMap', 'calendar'],
    defaultBlur: 5
  },
  treemap: {
    supportedFeatures: ['breadcrumb', 'roam', 'leafDepth'],
    defaultLeafDepth: null
  },
  sunburst: {
    supportedFeatures: ['roam', 'sort', 'highlight'],
    defaultRadius: [0, '90%']
  },
  sankey: {
    supportedFeatures: ['roam', 'emphasis', 'levels'],
    defaultCurveness: 0.5
  },
  graph: {
    supportedFeatures: ['layout', 'roam', 'emphasis'],
    defaultLayout: 'force'
  },
  tree: {
    supportedFeatures: ['roam', 'expandAndCollapse', 'initialTreeDepth'],
    defaultLayout: 'orthogonal'
  }
}

/**
 * ECharts-specific customization service
 */
export class EChartsCustomizationService {
  
  /**
   * Apply comprehensive customization to chart config
   */
  static applyCustomization(
    config: ChartConfig, 
    customization: Partial<EChartsCustomization>
  ): ChartConfig {
    console.log('🎨 Applying ECharts customization:', customization)
    
    const newConfig = { ...config }
    
    // Merge customization
    newConfig.customization = this.mergeCustomization(config.customization, customization)
    
    // Apply color palette if specified
    if (customization.colorPalette) {
      newConfig.data.datasets = newConfig.data.datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: this.getColorFromPalette(customization.colorPalette!, index)
      }))
    }
    
    console.log('✅ Applied ECharts customization:', newConfig)
    return newConfig
  }
  
  /**
   * Merge customization objects
   */
  static mergeCustomization(
    base: ChartCustomization, 
    updates: Partial<EChartsCustomization>
  ): EChartsCustomization {
    return {
      ...base,
      ...updates,
      colors: { ...base.colors, ...updates.colors },
      typography: { ...base.typography, ...updates.typography },
      layout: { ...base.layout, ...updates.layout },
      animations: { ...base.animations, ...updates.animations },
      responsive: { ...base.responsive, ...updates.responsive }
    } as EChartsCustomization
  }
  
  /**
   * Get color from palette by index
   */
  static getColorFromPalette(paletteName: keyof typeof ECHARTS_COLOR_PALETTES, index: number): string {
    const palette = ECHARTS_COLOR_PALETTES[paletteName] || ECHARTS_COLOR_PALETTES.default
    return palette[index % palette.length]
  }
  
  /**
   * Apply color palette to chart config
   */
  static applyColorPalette(
    config: ChartConfig,
    paletteName: keyof typeof ECHARTS_COLOR_PALETTES
  ): ChartConfig {
    const palette = ECHARTS_COLOR_PALETTES[paletteName]
    
    const newDatasets = config.data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: Array.isArray(dataset.backgroundColor) 
        ? palette 
        : palette[index % palette.length],
      borderColor: palette[index % palette.length]
    }))
    
    return {
      ...config,
      data: {
        ...config.data,
        datasets: newDatasets
      },
      customization: {
        ...config.customization,
        colorPalette: paletteName,
        colors: {
          ...config.customization.colors,
          primary: palette[0],
          secondary: palette[1],
          accent: palette[2]
        }
      }
    }
  }
  
  /**
   * Get supported features for chart type
   */
  static getSupportedFeatures(chartType: string): string[] {
    const config = ECHARTS_CHART_CONFIGS[chartType as keyof typeof ECHARTS_CHART_CONFIGS]
    return config?.supportedFeatures || []
  }
  
  /**
   * Check if feature is supported for chart type
   */
  static isFeatureSupported(chartType: string, feature: string): boolean {
    const supportedFeatures = this.getSupportedFeatures(chartType)
    return supportedFeatures.includes(feature)
  }
  
  /**
   * Get chart type configuration
   */
  static getChartConfig(chartType: string) {
    return ECHARTS_CHART_CONFIGS[chartType as keyof typeof ECHARTS_CHART_CONFIGS] || {}
  }
  
  /**
   * Generate gradient colors
   */
  static generateGradient(
    baseColor: string, 
    direction: 'horizontal' | 'vertical' | 'radial' = 'vertical'
  ): any {
    const gradientConfig = {
      type: 'linear' as const,
      x: 0,
      y: 0,
      x2: direction === 'horizontal' ? 1 : 0,
      y2: direction === 'vertical' ? 1 : 0,
      colorStops: [
        {
          offset: 0,
          color: baseColor
        },
        {
          offset: 1,
          color: this.adjustColorBrightness(baseColor, -30)
        }
      ]
    }
    
    if (direction === 'radial') {
      return {
        type: 'radial',
        x: 0.5,
        y: 0.5,
        r: 0.5,
        colorStops: gradientConfig.colorStops
      }
    }
    
    return gradientConfig
  }
  
  /**
   * Adjust color brightness
   */
  static adjustColorBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1)
  }
  
  /**
   * Generate theme configuration
   */
  static generateTheme(themeName: keyof typeof ECHARTS_THEMES): any {
    const theme = ECHARTS_THEMES[themeName]
    
    return {
      backgroundColor: theme.backgroundColor,
      textStyle: {
        color: theme.textColor,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      title: {
        textStyle: {
          color: theme.textColor
        }
      },
      legend: {
        textStyle: {
          color: theme.textColor
        }
      },
      categoryAxis: {
        axisLine: {
          lineStyle: {
            color: theme.axisColor
          }
        },
        axisTick: {
          lineStyle: {
            color: theme.axisColor
          }
        },
        axisLabel: {
          textStyle: {
            color: theme.textColor
          }
        },
        splitLine: {
          lineStyle: {
            color: theme.gridColor
          }
        }
      },
      valueAxis: {
        axisLine: {
          lineStyle: {
            color: theme.axisColor
          }
        },
        axisTick: {
          lineStyle: {
            color: theme.axisColor
          }
        },
        axisLabel: {
          textStyle: {
            color: theme.textColor
          }
        },
        splitLine: {
          lineStyle: {
            color: theme.gridColor
          }
        }
      }
    }
  }
  
  /**
   * Create animation configuration
   */
  static createAnimationConfig(customization: EChartsCustomization): any {
    if (!customization.animations?.enabled) {
      return { animation: false }
    }
    
    return {
      animation: true,
      animationDuration: customization.animations.duration || 1000,
      animationEasing: customization.animations.easing || 'cubicOut',
      animationDelay: (idx: number) => idx * 100,
      animationDurationUpdate: 500,
      animationEasingUpdate: 'cubicInOut'
    }
  }
  
  /**
   * Create toolbox configuration
   */
  static createToolboxConfig(customization: EChartsCustomization): any {
    if (!customization.toolbox?.enabled) {
      return null
    }
    
    const features: any = {}
    
    if (customization.toolbox.features.includes('saveAsImage')) {
      features.saveAsImage = {
        show: true,
        title: 'Save as Image'
      }
    }
    
    if (customization.toolbox.features.includes('dataView')) {
      features.dataView = {
        show: true,
        title: 'Data View',
        readOnly: false
      }
    }
    
    if (customization.toolbox.features.includes('magicType')) {
      features.magicType = {
        show: true,
        title: {
          line: 'Line',
          bar: 'Bar',
          stack: 'Stack',
          tiled: 'Tiled'
        },
        type: ['line', 'bar', 'stack', 'tiled']
      }
    }
    
    if (customization.toolbox.features.includes('restore')) {
      features.restore = {
        show: true,
        title: 'Restore'
      }
    }
    
    if (customization.toolbox.features.includes('dataZoom')) {
      features.dataZoom = {
        show: true,
        title: {
          zoom: 'Zoom',
          back: 'Back'
        }
      }
    }
    
    return {
      show: true,
      feature: features,
      right: 20,
      top: 20
    }
  }
  
  /**
   * Create data zoom configuration
   */
  static createDataZoomConfig(customization: EChartsCustomization): any[] {
    if (!customization.dataZoom?.enabled) {
      return []
    }
    
    const configs = []
    
    if (customization.dataZoom.type === 'slider' || customization.dataZoom.type === 'both') {
      configs.push({
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100
      })
    }
    
    if (customization.dataZoom.type === 'inside' || customization.dataZoom.type === 'both') {
      configs.push({
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 100
      })
    }
    
    return configs
  }
  
  /**
   * Create brush configuration
   */
  static createBrushConfig(customization: EChartsCustomization): any {
    if (!customization.brush?.enabled) {
      return null
    }
    
    return {
      toolbox: customization.brush.toolbox ? ['rect', 'polygon', 'clear'] : [],
      brushLink: 'all',
      series: 'all',
      geoIndex: 'all',
      xAxisIndex: 'all',
      yAxisIndex: 'all'
    }
  }
  
  /**
   * Create emphasis configuration
   */
  static createEmphasisConfig(customization: EChartsCustomization): any {
    if (!customization.emphasis) {
      return {
        focus: 'series',
        scale: 1.1
      }
    }
    
    return {
      focus: customization.emphasis.focus || 'series',
      scale: customization.emphasis.scale || 1.1,
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }
}

export default EChartsCustomizationService