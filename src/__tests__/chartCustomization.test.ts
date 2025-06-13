import { ChartCustomizationService, COLOR_PALETTES, TYPOGRAPHY_PRESETS, DEFAULT_CUSTOMIZATION } from '@/lib/chartCustomization'
import { ChartConfig, ChartCustomization } from '@/types/chart'

describe('ChartCustomizationService', () => {
  const mockChartConfig: ChartConfig = {
    type: 'bar',
    data: {
      labels: ['A', 'B', 'C'],
      datasets: [{
        label: 'Test Dataset',
        data: [1, 2, 3],
        backgroundColor: ['#ff0000', '#00ff00', '#0000ff'],
        borderColor: ['#ff0000', '#00ff00', '#0000ff'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Test Chart'
        },
        legend: {
          display: true
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'X Axis'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Y Axis'
          }
        }
      }
    },
    customization: DEFAULT_CUSTOMIZATION
  }

  describe('applyCustomization', () => {
    it('should apply default customization when no overrides provided', () => {
      const result = ChartCustomizationService.applyCustomization(mockChartConfig, {})
      
      expect(result.customization).toEqual(DEFAULT_CUSTOMIZATION)
      expect(result.data).toBeDefined()
      expect(result.options).toBeDefined()
    })

    it('should apply color customization to chart data', () => {
      const customColors = {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff',
        background: '#ffffff',
        text: '#000000'
      }

      const result = ChartCustomizationService.applyCustomization(mockChartConfig, {
        colors: customColors
      })

      // Check that colors are applied to dataset
      const dataset = result.data.datasets[0]
      expect(Array.isArray(dataset.backgroundColor)).toBe(true)
      expect(dataset.backgroundColor).toContain(customColors.primary)
    })

    it('should apply typography customization', () => {
      const customTypography = {
        fontFamily: 'Arial, sans-serif',
        fontSize: {
          title: 24,
          labels: 14,
          legend: 16
        }
      }

      const result = ChartCustomizationService.applyCustomization(mockChartConfig, {
        typography: customTypography
      })

      expect(result.options?.plugins?.title?.font?.family).toBe(customTypography.fontFamily)
      expect(result.options?.plugins?.title?.font?.size).toBe(customTypography.fontSize.title)
      expect(result.options?.plugins?.legend?.labels?.font?.family).toBe(customTypography.fontFamily)
      expect(result.options?.plugins?.legend?.labels?.font?.size).toBe(customTypography.fontSize.legend)
    })

    it('should apply layout customization', () => {
      const customLayout = {
        padding: {
          top: 30,
          right: 40,
          bottom: 50,
          left: 60
        }
      }

      const result = ChartCustomizationService.applyCustomization(mockChartConfig, {
        layout: customLayout
      })

      expect(result.options?.layout?.padding).toEqual(customLayout.padding)
    })

    it('should apply animation customization', () => {
      const customAnimations = {
        enabled: false,
        duration: 2000,
        easing: 'easeInQuad' as const
      }

      const result = ChartCustomizationService.applyCustomization(mockChartConfig, {
        animations: customAnimations
      })

      expect(result.options?.animation).toBe(false)

      // Test enabled animations
      const enabledAnimations = {
        enabled: true,
        duration: 1500,
        easing: 'easeOutCubic' as const
      }

      const resultEnabled = ChartCustomizationService.applyCustomization(mockChartConfig, {
        animations: enabledAnimations
      })

      expect(resultEnabled.options?.animation).toEqual({
        duration: enabledAnimations.duration,
        easing: enabledAnimations.easing
      })
    })
  })

  describe('mergeCustomization', () => {
    it('should merge partial customization with base customization', () => {
      const partialCustomization = {
        colors: {
          primary: '#ff0000'
        },
        typography: {
          fontSize: {
            title: 24
          }
        }
      }

      const result = ChartCustomizationService.mergeCustomization(
        DEFAULT_CUSTOMIZATION,
        partialCustomization
      )

      expect(result.colors.primary).toBe('#ff0000')
      expect(result.colors.secondary).toBe(DEFAULT_CUSTOMIZATION.colors.secondary)
      expect(result.typography.fontSize.title).toBe(24)
      expect(result.typography.fontSize.labels).toBe(DEFAULT_CUSTOMIZATION.typography.fontSize.labels)
    })

    it('should handle nested object merging correctly', () => {
      const partialCustomization = {
        layout: {
          padding: {
            top: 50
          }
        }
      }

      const result = ChartCustomizationService.mergeCustomization(
        DEFAULT_CUSTOMIZATION,
        partialCustomization
      )

      expect(result.layout.padding.top).toBe(50)
      expect(result.layout.padding.bottom).toBe(DEFAULT_CUSTOMIZATION.layout.padding.bottom)
      expect(result.layout.padding.left).toBe(DEFAULT_CUSTOMIZATION.layout.padding.left)
      expect(result.layout.padding.right).toBe(DEFAULT_CUSTOMIZATION.layout.padding.right)
    })
  })

  describe('applyDataCustomization', () => {
    it('should apply color palette to datasets', () => {
      const customization: ChartCustomization = {
        ...DEFAULT_CUSTOMIZATION,
        colors: {
          primary: '#ff0000',
          secondary: '#00ff00',
          accent: '#0000ff',
          background: '#ffffff',
          text: '#000000'
        }
      }

      const result = ChartCustomizationService.applyDataCustomization(
        mockChartConfig.data,
        customization
      )

      const dataset = result.datasets[0]
      expect(Array.isArray(dataset.backgroundColor)).toBe(true)
      expect(dataset.backgroundColor[0]).toBe('#ff0000') // primary color
    })

    it('should handle multiple datasets', () => {
      const multiDatasetConfig = {
        ...mockChartConfig.data,
        datasets: [
          { ...mockChartConfig.data.datasets[0], label: 'Dataset 1' },
          { ...mockChartConfig.data.datasets[0], label: 'Dataset 2' }
        ]
      }

      const result = ChartCustomizationService.applyDataCustomization(
        multiDatasetConfig,
        DEFAULT_CUSTOMIZATION
      )

      expect(result.datasets).toHaveLength(2)
      expect(result.datasets[0].backgroundColor).toBeDefined()
      expect(result.datasets[1].backgroundColor).toBeDefined()
    })
  })

  describe('generateColorPalette', () => {
    it('should generate color palette from custom colors', () => {
      const customColors = {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff',
        background: '#ffffff',
        text: '#000000'
      }

      const palette = ChartCustomizationService.generateColorPalette(customColors)

      expect(palette).toHaveLength(6)
      expect(palette[0]).toBe(customColors.primary)
      expect(palette[1]).toBe(customColors.secondary)
      expect(palette[2]).toBe(customColors.accent)
    })

    it('should generate default palette when no colors provided', () => {
      const palette = ChartCustomizationService.generateColorPalette()

      expect(palette).toHaveLength(6)
      expect(palette[0]).toBe(DEFAULT_CUSTOMIZATION.colors.primary)
    })
  })

  describe('color utility functions', () => {
    describe('lightenColor', () => {
      it('should lighten a hex color', () => {
        const lightened = ChartCustomizationService.lightenColor('#000000', 0.5)
        expect(lightened).toMatch(/^#[0-9a-f]{6}$/i)
        expect(lightened).not.toBe('#000000')
      })

      it('should handle colors without # prefix', () => {
        const lightened = ChartCustomizationService.lightenColor('000000', 0.3)
        expect(lightened).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    describe('darkenColor', () => {
      it('should darken a hex color', () => {
        const darkened = ChartCustomizationService.darkenColor('#ffffff', 0.5)
        expect(darkened).toMatch(/^#[0-9a-f]{6}$/i)
        expect(darkened).not.toBe('#ffffff')
      })

      it('should not go below #000000', () => {
        const darkened = ChartCustomizationService.darkenColor('#000000', 1.0)
        expect(darkened).toBe('#000000')
      })
    })

    describe('addAlpha', () => {
      it('should convert hex to rgba with alpha', () => {
        const rgba = ChartCustomizationService.addAlpha('#ff0000', 0.5)
        expect(rgba).toBe('rgba(255, 0, 0, 0.5)')
      })

      it('should handle colors without # prefix', () => {
        const rgba = ChartCustomizationService.addAlpha('00ff00', 0.8)
        expect(rgba).toBe('rgba(0, 255, 0, 0.8)')
      })
    })
  })

  describe('getResponsiveOptions', () => {
    it('should return responsive options when enabled', () => {
      const customization: ChartCustomization = {
        ...DEFAULT_CUSTOMIZATION,
        responsive: {
          enabled: true,
          breakpoints: {
            mobile: 480,
            tablet: 768,
            desktop: 1024
          }
        }
      }

      const options = ChartCustomizationService.getResponsiveOptions(customization)

      expect(options.responsive).toBe(true)
      expect(options.maintainAspectRatio).toBe(false)
      expect(options.onResize).toBeDefined()
    })

    it('should return empty object when responsive disabled', () => {
      const customization: ChartCustomization = {
        ...DEFAULT_CUSTOMIZATION,
        responsive: {
          enabled: false,
          breakpoints: {
            mobile: 480,
            tablet: 768,
            desktop: 1024
          }
        }
      }

      const options = ChartCustomizationService.getResponsiveOptions(customization)

      expect(Object.keys(options)).toHaveLength(0)
    })
  })

  describe('COLOR_PALETTES', () => {
    it('should contain valid color palettes', () => {
      Object.entries(COLOR_PALETTES).forEach(([name, colors]) => {
        expect(Array.isArray(colors)).toBe(true)
        expect(colors.length).toBeGreaterThan(0)
        
        colors.forEach(color => {
          expect(color).toMatch(/^#[0-9a-f]{6}$/i)
        })
      })
    })

    it('should have all expected palettes', () => {
      const expectedPalettes = ['default', 'ocean', 'sunset', 'forest', 'monochrome', 'pastel', 'vibrant']
      expectedPalettes.forEach(palette => {
        expect(COLOR_PALETTES).toHaveProperty(palette)
      })
    })
  })

  describe('TYPOGRAPHY_PRESETS', () => {
    it('should contain valid typography presets', () => {
      Object.entries(TYPOGRAPHY_PRESETS).forEach(([name, preset]) => {
        expect(preset).toHaveProperty('fontFamily')
        expect(preset).toHaveProperty('fontSize')
        expect(preset.fontSize).toHaveProperty('title')
        expect(preset.fontSize).toHaveProperty('labels')
        expect(preset.fontSize).toHaveProperty('legend')
        
        expect(typeof preset.fontFamily).toBe('string')
        expect(typeof preset.fontSize.title).toBe('number')
        expect(typeof preset.fontSize.labels).toBe('number')
        expect(typeof preset.fontSize.legend).toBe('number')
      })
    })

    it('should have all expected presets', () => {
      const expectedPresets = ['modern', 'classic', 'minimal', 'bold']
      expectedPresets.forEach(preset => {
        expect(TYPOGRAPHY_PRESETS).toHaveProperty(preset)
      })
    })
  })
})