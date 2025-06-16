import { ChartCustomization, ChartConfig, ChartOptions } from '@/types/chart'

export const DEFAULT_CUSTOMIZATION: ChartCustomization = {
  colors: {
    primary: '#3b82f6',
    secondary: '#1e40af',
    accent: '#60a5fa',
    background: '#ffffff',
    text: '#1f2937'
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      title: 18,
      labels: 12,
      legend: 14
    }
  },
  layout: {
    padding: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  },
  animations: {
    enabled: true,
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  responsive: {
    enabled: true,
    breakpoints: {
      mobile: 480,
      tablet: 768,
      desktop: 1024
    }
  }
}

export const COLOR_PALETTES = {
  default: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
  ocean: ['#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#84cc16', '#eab308'],
  sunset: ['#f97316', '#ef4444', '#ec4899', '#a855f7', '#6366f1', '#3b82f6'],
  forest: ['#16a34a', '#15803d', '#166534', '#14532d', '#052e16', '#064e3b'],
  monochrome: ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db'],
  pastel: ['#fecaca', '#fed7aa', '#fef3c7', '#d9f99d', '#a7f3d0', '#bfdbfe'],
  vibrant: ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#7c3aed']
}

export const TYPOGRAPHY_PRESETS = {
  modern: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: { title: 20, labels: 12, legend: 14 }
  },
  classic: {
    fontFamily: 'Georgia, serif',
    fontSize: { title: 18, labels: 11, legend: 13 }
  },
  minimal: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: { title: 16, labels: 10, legend: 12 }
  },
  bold: {
    fontFamily: 'Arial Black, sans-serif',
    fontSize: { title: 22, labels: 13, legend: 15 }
  }
}

export class ChartCustomizationService {
  static applyCustomization(config: ChartConfig, customization: Partial<ChartCustomization>): ChartConfig {
    const merged = this.mergeCustomization(DEFAULT_CUSTOMIZATION, customization)
    
    return {
      ...config,
      data: this.applyDataCustomization(config.data, merged),
      options: this.applyOptionsCustomization(config.options, merged),
      customization: merged
    }
  }

  static mergeCustomization(
    base: ChartCustomization, 
    override: Partial<ChartCustomization>
  ): ChartCustomization {
    return {
      colors: { ...base.colors, ...override.colors },
      typography: {
        fontFamily: override.typography?.fontFamily || base.typography.fontFamily,
        fontSize: { ...base.typography.fontSize, ...override.typography?.fontSize }
      },
      layout: {
        padding: { ...base.layout.padding, ...override.layout?.padding }
      },
      animations: { ...base.animations, ...override.animations },
      responsive: {
        enabled: override.responsive?.enabled ?? base.responsive.enabled,
        breakpoints: { ...base.responsive.breakpoints, ...override.responsive?.breakpoints }
      }
    }
  }

  static applyDataCustomization(data: any, customization: ChartCustomization) {
    const colorPalette = this.generateColorPalette(customization.colors)
    
    return {
      ...data,
      datasets: data.datasets.map((dataset: any, index: number) => {
        const baseColor = colorPalette[index % colorPalette.length]
        return {
          ...dataset,
          backgroundColor: Array.isArray(dataset.backgroundColor) 
            ? colorPalette.slice(0, dataset.backgroundColor.length)
            : baseColor,
          borderColor: Array.isArray(dataset.borderColor)
            ? colorPalette.slice(0, dataset.borderColor.length).map(color => this.darkenColor(color, 0.2))
            : this.darkenColor(baseColor, 0.2),
          borderWidth: dataset.borderWidth || 2
        }
      })
    }
  }

  static applyOptionsCustomization(options: ChartOptions, customization: ChartCustomization): ChartOptions {
    return {
      ...options,
      responsive: customization.responsive.enabled,
      plugins: {
        ...options.plugins,
        title: {
          ...options.plugins?.title,
          font: {
            size: customization.typography.fontSize.title,
            family: customization.typography.fontFamily,
            weight: 'bold'
          },
          color: customization.colors.text
        },
        legend: {
          ...options.plugins?.legend,
          labels: {
            ...options.plugins?.legend?.labels,
            color: customization.colors.text,
            font: {
              size: customization.typography.fontSize.legend,
              family: customization.typography.fontFamily
            }
          }
        },
        tooltip: {
          ...options.plugins?.tooltip,
          backgroundColor: this.addAlpha(customization.colors.text, 0.9),
          titleColor: customization.colors.background,
          bodyColor: customization.colors.background,
          borderColor: customization.colors.primary,
          borderWidth: 1
        }
      },
      scales: {
        ...options.scales,
        x: {
          ...options.scales?.x,
          title: {
            ...options.scales?.x?.title,
            color: customization.colors.text,
            font: {
              size: customization.typography.fontSize.labels,
              family: customization.typography.fontFamily
            }
          },
          ticks: {
            ...options.scales?.x?.ticks,
            color: customization.colors.text,
            font: {
              size: customization.typography.fontSize.labels,
              family: customization.typography.fontFamily
            }
          },
          grid: {
            ...options.scales?.x?.grid,
            color: this.addAlpha(customization.colors.text, 0.1)
          }
        },
        y: {
          ...options.scales?.y,
          title: {
            ...options.scales?.y?.title,
            color: customization.colors.text,
            font: {
              size: customization.typography.fontSize.labels,
              family: customization.typography.fontFamily
            }
          },
          ticks: {
            ...options.scales?.y?.ticks,
            color: customization.colors.text,
            font: {
              size: customization.typography.fontSize.labels,
              family: customization.typography.fontFamily
            }
          },
          grid: {
            ...options.scales?.y?.grid,
            color: this.addAlpha(customization.colors.text, 0.1)
          }
        }
      },
      layout: {
        padding: customization.layout.padding
      },
      animation: customization.animations.enabled ? {
        duration: customization.animations.duration,
        easing: customization.animations.easing as any
      } : false
    }
  }

  static generateColorPalette(colors = DEFAULT_CUSTOMIZATION.colors): string[] {
    return [
      colors.primary,
      colors.secondary,
      colors.accent,
      this.lightenColor(colors.primary, 0.3),
      this.darkenColor(colors.secondary, 0.2),
      this.lightenColor(colors.accent, 0.4)
    ]
  }

  static lightenColor(color: string, amount: number): string {
    const hex = color.replace('#', '')
    const num = parseInt(hex, 16)
    const amt = Math.round(2.55 * amount * 100)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
  }

  static darkenColor(color: string, amount: number): string {
    const hex = color.replace('#', '')
    const num = parseInt(hex, 16)
    const amt = Math.round(2.55 * amount * 100)
    const R = (num >> 16) - amt
    const G = (num >> 8 & 0x00FF) - amt
    const B = (num & 0x0000FF) - amt
    return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1)
  }

  static addAlpha(color: string, alpha: number): string {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  static getResponsiveOptions(customization: ChartCustomization) {
    if (!customization.responsive.enabled) return {}

    return {
      responsive: true,
      maintainAspectRatio: false,
      onResize: (chart: any, size: any) => {
        const { width } = size
        const { mobile, tablet } = customization.responsive.breakpoints
        
        if (width <= mobile) {
          chart.options.plugins.legend.position = 'bottom'
          chart.options.plugins.title.font.size = customization.typography.fontSize.title - 2
        } else if (width <= tablet) {
          chart.options.plugins.legend.position = 'top'
          chart.options.plugins.title.font.size = customization.typography.fontSize.title - 1
        } else {
          chart.options.plugins.legend.position = 'top'
          chart.options.plugins.title.font.size = customization.typography.fontSize.title
        }
      }
    }
  }
}