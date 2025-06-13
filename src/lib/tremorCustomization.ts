import { ChartConfig, ChartCustomization } from '@/types/chart'
import { TremorChartConfig } from './tremorDataTransforms'

// Tremor-specific color palettes
export const TREMOR_COLOR_PALETTES = {
  default: ['blue', 'emerald', 'violet', 'amber', 'rose', 'cyan'],
  business: ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red'],
  vibrant: ['red', 'orange', 'amber', 'yellow', 'lime', 'green'],
  cool: ['blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink'],
  warm: ['red', 'orange', 'amber', 'yellow', 'lime', 'emerald'],
  monochrome: ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red'],
  ocean: ['blue', 'cyan', 'teal', 'emerald', 'green', 'lime'],
  sunset: ['red', 'orange', 'amber', 'yellow', 'pink', 'rose']
}

// Chart type configurations for Tremor
export const TREMOR_CHART_CONFIGS = {
  bar: {
    defaultHeight: 'h-80',
    supportedOptions: ['stack', 'relative', 'layout', 'showGridLines'],
    colorCount: 6
  },
  line: {
    defaultHeight: 'h-80', 
    supportedOptions: ['connectNulls', 'curveType', 'showGridLines'],
    colorCount: 4
  },
  area: {
    defaultHeight: 'h-80',
    supportedOptions: ['stack', 'relative', 'connectNulls', 'curveType'],
    colorCount: 4
  },
  pie: {
    defaultHeight: 'h-80',
    supportedOptions: ['showLabel', 'showTooltip'],
    colorCount: 8
  },
  donut: {
    defaultHeight: 'h-80', 
    supportedOptions: ['showLabel', 'showTooltip'],
    colorCount: 8
  }
}

/**
 * Tremor-specific customization service
 */
export class TremorCustomizationService {
  
  /**
   * Apply customization to Tremor chart config
   */
  static applyCustomizationToTremor(
    tremorConfig: TremorChartConfig, 
    customization: ChartCustomization
  ): TremorChartConfig {
    console.log('🎨 Applying customization to Tremor config:', { tremorConfig, customization })
    
    const chartType = tremorConfig.type.replace('Chart', '').toLowerCase()
    const config = TREMOR_CHART_CONFIGS[chartType as keyof typeof TREMOR_CHART_CONFIGS] || TREMOR_CHART_CONFIGS.bar
    
    // Apply color customization - ensure we have good colors
    const colors = this.getCustomColors(customization.colors, config.colorCount)
    console.log('🎨 Final customization colors:', colors)
    
    // Apply other customizations
    const result = {
      ...tremorConfig,
      colors,
      valueFormatter: this.createCustomValueFormatter(customization),
      showLegend: true, // Always show legend for better UX
      showTooltip: true, // Always show tooltips
      showGridLines: customization.layout ? true : tremorConfig.showGridLines
    }
    
    console.log('✅ Applied customization result:', result)
    return result
  }

  /**
   * Get custom colors based on customization
   */
  private static getCustomColors(colorConfig: any, maxColors: number = 6): string[] {
    console.log('🎨 Getting custom colors for:', colorConfig)
    
    // Always start with bright, visible Tremor colors
    const baseColors = [
      'blue',
      'emerald', 
      'violet',
      'amber',
      'rose',
      'cyan',
      'orange',
      'lime'
    ]
    
    // If we have custom colors, try to map them
    if (colorConfig && (colorConfig.primary || colorConfig.secondary || colorConfig.accent)) {
      const customColors = [
        this.hexToTremorColor(colorConfig.primary || '#3b82f6'),
        this.hexToTremorColor(colorConfig.secondary || '#ef4444'), 
        this.hexToTremorColor(colorConfig.accent || '#10b981'),
        ...baseColors.slice(3) // Fill the rest with defaults
      ]
      console.log('🎨 Using custom colors:', customColors.slice(0, maxColors))
      return customColors.slice(0, maxColors)
    }
    
    console.log('🎨 Using default colors:', baseColors.slice(0, maxColors))
    return baseColors.slice(0, maxColors)
  }

  /**
   * Convert hex colors to Tremor color names
   */
  private static hexToTremorColor(hex: string): string {
    const colorMap: Record<string, string> = {
      // Blues
      '#3b82f6': 'blue',
      '#1d4ed8': 'blue',
      '#2563eb': 'blue',
      
      // Reds  
      '#ef4444': 'red',
      '#dc2626': 'red',
      '#b91c1c': 'red',
      
      // Greens
      '#10b981': 'emerald', 
      '#059669': 'emerald',
      '#047857': 'emerald',
      '#22c55e': 'green',
      
      // Oranges
      '#f97316': 'orange',
      '#ea580c': 'orange',
      '#c2410c': 'orange',
      
      // Purples
      '#8b5cf6': 'violet',
      '#7c3aed': 'violet', 
      '#6d28d9': 'violet',
      
      // Yellows
      '#f59e0b': 'amber',
      '#d97706': 'amber',
      '#92400e': 'amber',
      
      // Pinks
      '#ec4899': 'pink',
      '#db2777': 'pink',
      '#be185d': 'pink',
      
      // Cyans
      '#06b6d4': 'cyan',
      '#0891b2': 'cyan',
      '#0e7490': 'cyan'
    }
    
    return colorMap[hex.toLowerCase()] || 'blue'
  }

  /**
   * Create custom value formatter
   */
  private static createCustomValueFormatter(customization: ChartCustomization) {
    return (value: number): string => {
      // Apply number formatting based on customization
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
   * Get chart height class based on customization
   */
  static getChartHeight(customization: ChartCustomization): string {
    // Could be made customizable based on layout preferences
    return 'h-80'
  }

  /**
   * Apply color palette to configuration
   */
  static applyColorPalette(
    config: ChartConfig,
    paletteName: keyof typeof TREMOR_COLOR_PALETTES
  ): ChartConfig {
    const palette = TREMOR_COLOR_PALETTES[paletteName]
    
    // Update the datasets with new colors
    const newDatasets = config.data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: this.tremorColorToHex(palette[index % palette.length])
    }))
    
    return {
      ...config,
      data: {
        ...config.data,
        datasets: newDatasets
      },
      customization: {
        ...config.customization,
        colors: {
          ...config.customization.colors,
          primary: this.tremorColorToHex(palette[0]),
          secondary: this.tremorColorToHex(palette[1]),
          accent: this.tremorColorToHex(palette[2])
        }
      }
    }
  }

  /**
   * Convert Tremor color names back to hex (for backwards compatibility)
   */
  static tremorColorToHex(tremorColor: string): string {
    const colorMap: Record<string, string> = {
      'blue': '#3b82f6',
      'red': '#ef4444',
      'emerald': '#10b981',
      'green': '#22c55e',
      'orange': '#f97316',
      'violet': '#8b5cf6',
      'purple': '#a855f7',
      'amber': '#f59e0b',
      'yellow': '#eab308',
      'pink': '#ec4899',
      'rose': '#f43f5e',
      'cyan': '#06b6d4',
      'teal': '#14b8a6',
      'lime': '#84cc16',
      'slate': '#64748b',
      'gray': '#6b7280',
      'zinc': '#71717a',
      'neutral': '#737373',
      'stone': '#78716c'
    }
    
    return colorMap[tremorColor] || tremorColor
  }

  /**
   * Get available customization options for a chart type
   */
  static getAvailableOptions(chartType: string): string[] {
    const type = chartType.toLowerCase()
    const config = TREMOR_CHART_CONFIGS[type as keyof typeof TREMOR_CHART_CONFIGS]
    return config?.supportedOptions || []
  }

  /**
   * Validate if a customization option is supported for a chart type
   */
  static isOptionSupported(chartType: string, option: string): boolean {
    const availableOptions = this.getAvailableOptions(chartType)
    return availableOptions.includes(option)
  }
}

export default TremorCustomizationService