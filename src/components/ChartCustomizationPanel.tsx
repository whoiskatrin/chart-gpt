import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Palette, Type, Layout, Zap, Download, RefreshCw } from 'lucide-react'
import { ChartConfig, ChartCustomization } from '@/types/chart'
import { COLOR_PALETTES, TYPOGRAPHY_PRESETS, ChartCustomizationService } from '@/lib/chartCustomization'

interface ChartCustomizationPanelProps {
  config: ChartConfig
  onConfigChange: (newConfig: ChartConfig) => void
  onExport?: (format: 'png' | 'jpg' | 'svg') => void
}

type PanelSection = 'colors' | 'typography' | 'layout' | 'animations' | 'data'

export const ChartCustomizationPanel: React.FC<ChartCustomizationPanelProps> = ({
  config,
  onConfigChange,
  onExport
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<PanelSection>>(new Set(['colors']))
  const [customization, setCustomization] = useState<ChartCustomization>(config.customization)

  const toggleSection = (section: PanelSection) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateCustomization = (updates: Partial<ChartCustomization>) => {
    const newCustomization = ChartCustomizationService.mergeCustomization(customization, updates)
    setCustomization(newCustomization)
    
    // Apply the full merged customization to the config
    const newConfig = ChartCustomizationService.applyCustomization(config, newCustomization)
    onConfigChange(newConfig)
  }

  const applyColorPalette = (paletteName: keyof typeof COLOR_PALETTES) => {
    const palette = COLOR_PALETTES[paletteName]
    const newColors = {
      ...customization.colors,
      primary: palette[0],
      secondary: palette[1],
      accent: palette[2]
    }
    updateCustomization({
      colors: newColors
    })
  }

  const applyTypographyPreset = (presetName: keyof typeof TYPOGRAPHY_PRESETS) => {
    const preset = TYPOGRAPHY_PRESETS[presetName]
    updateCustomization({
      typography: preset
    })
  }

  const updateChartType = (newType: string) => {
    const newConfig = {
      ...config,
      type: newType as any
    }
    // Apply current customization to the new chart type
    const customizedConfig = ChartCustomizationService.applyCustomization(newConfig, customization)
    onConfigChange(customizedConfig)
  }

  const resetToDefaults = () => {
    const defaultConfig = ChartCustomizationService.applyCustomization(config, {})
    setCustomization(defaultConfig.customization)
    onConfigChange(defaultConfig)
  }

  const SectionHeader = ({ 
    section, 
    icon: Icon, 
    title 
  }: { 
    section: PanelSection
    icon: React.ComponentType<any>
    title: string 
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-4 bg-[#1a1a1a] hover:bg-[#3a3a3a] transition-all duration-300 rounded-xl"
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-[#cc785c]" />
        <span className="text-lg font-normal text-[#f5f5f5]">{title}</span>
      </div>
      {expandedSections.has(section) ? (
        <ChevronUp className="w-5 h-5 text-[#a3a3a3]" />
      ) : (
        <ChevronDown className="w-5 h-5 text-[#a3a3a3]" />
      )}
    </button>
  )

  return (
    <div className="bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-normal text-[#f5f5f5] tracking-tight">Customize Your Chart</h3>
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 bg-[#3a3a3a] text-[#a3a3a3] rounded-full text-sm hover:bg-[#4a4a4a] transition-all duration-300 flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Chart Type Selection - Prominent */}
      <div className="space-y-4">
        <label className="block text-xl font-normal text-[#f5f5f5] tracking-tight">Choose Chart Type</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'bar', label: 'Bar Chart', icon: '📊' },
            { value: 'line', label: 'Line Chart', icon: '📈' },
            { value: 'pie', label: 'Pie Chart', icon: '🍰' },
            { value: 'doughnut', label: 'Doughnut', icon: '🍩' },
            { value: 'scatter', label: 'Scatter Plot', icon: '•' },
            { value: 'area', label: 'Area Chart', icon: '🏔️' },
            { value: 'radar', label: 'Radar Chart', icon: '🕸️' },
            { value: 'polarArea', label: 'Polar Area', icon: '🔴' },
            { value: 'bubble', label: 'Bubble Chart', icon: '🔵' }
          ].map((chartType) => (
            <button
              key={chartType.value}
              onClick={() => updateChartType(chartType.value)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                config.type === chartType.value
                  ? 'border-[#cc785c] bg-[#cc785c]/20 text-[#f5f5f5]'
                  : 'border-[#3a3a3a] bg-[#1a1a1a] text-[#a3a3a3] hover:border-[#cc785c]/50 hover:bg-[#2a2a2a]'
              }`}
            >
              <div className="text-lg mb-1">{chartType.icon}</div>
              <div className="text-xs font-medium">{chartType.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Title & Description */}
      <div className="space-y-3">
        <label className="block text-xl font-normal text-[#f5f5f5] tracking-tight">Chart Title & Labels</label>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[#a3a3a3] mb-2">Chart Title</label>
            <input
              type="text"
              value={config.options?.plugins?.title?.text || ''}
              onChange={(e) => {
                const newConfig = {
                  ...config,
                  options: {
                    ...config.options,
                    plugins: {
                      ...config.options?.plugins,
                      title: {
                        ...config.options?.plugins?.title,
                        text: e.target.value,
                        display: true
                      }
                    }
                  }
                }
                onConfigChange(newConfig)
              }}
              placeholder="Enter chart title..."
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] text-[#f5f5f5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc785c] transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm text-[#a3a3a3] mb-2">X-Axis Label</label>
            <input
              type="text"
              value={config.options?.scales?.x?.title?.text || ''}
              onChange={(e) => {
                const newConfig = {
                  ...config,
                  options: {
                    ...config.options,
                    scales: {
                      ...config.options?.scales,
                      x: {
                        ...config.options?.scales?.x,
                        title: {
                          ...config.options?.scales?.x?.title,
                          text: e.target.value,
                          display: !!e.target.value
                        }
                      }
                    }
                  }
                }
                onConfigChange(newConfig)
              }}
              placeholder="X-axis label..."
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] text-[#f5f5f5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc785c] transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm text-[#a3a3a3] mb-2">Y-Axis Label</label>
            <input
              type="text"
              value={config.options?.scales?.y?.title?.text || ''}
              onChange={(e) => {
                const newConfig = {
                  ...config,
                  options: {
                    ...config.options,
                    scales: {
                      ...config.options?.scales,
                      y: {
                        ...config.options?.scales?.y,
                        title: {
                          ...config.options?.scales?.y?.title,
                          text: e.target.value,
                          display: !!e.target.value
                        }
                      }
                    }
                  }
                }
                onConfigChange(newConfig)
              }}
              placeholder="Y-axis label..."
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] text-[#f5f5f5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc785c] transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Colors Section */}
      <div className="space-y-3">
        <SectionHeader section="colors" icon={Palette} title="Colors & Themes" />
        {expandedSections.has('colors') && (
          <div className="space-y-4 pl-4">
            {/* Color Palettes */}
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Color Palettes</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(COLOR_PALETTES).map(([name, colors]) => (
                  <button
                    key={name}
                    onClick={() => applyColorPalette(name as keyof typeof COLOR_PALETTES)}
                    className="flex items-center space-x-2 p-2 bg-[#1a1a1a] hover:bg-[#3a3a3a] rounded-lg transition-colors border border-[#3a3a3a] hover:border-[#cc785c]/50"
                  >
                    <div className="flex space-x-1">
                      {colors.slice(0, 3).map((color, idx) => (
                        <div
                          key={idx}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[#f5f5f5] capitalize">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Color Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Primary Color</label>
                <input
                  type="color"
                  value={customization.colors.primary}
                  onChange={(e) => updateCustomization({
                    colors: { ...customization.colors, primary: e.target.value }
                  })}
                  className="w-full h-8 rounded border border-[#3a3a3a] bg-[#1a1a1a] cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Secondary Color</label>
                <input
                  type="color"
                  value={customization.colors.secondary}
                  onChange={(e) => updateCustomization({
                    colors: { ...customization.colors, secondary: e.target.value }
                  })}
                  className="w-full h-8 rounded border border-[#3a3a3a] bg-[#1a1a1a] cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Background</label>
                <input
                  type="color"
                  value={customization.colors.background}
                  onChange={(e) => updateCustomization({
                    colors: { ...customization.colors, background: e.target.value }
                  })}
                  className="w-full h-8 rounded border border-[#3a3a3a] bg-[#1a1a1a] cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Text Color</label>
                <input
                  type="color"
                  value={customization.colors.text}
                  onChange={(e) => updateCustomization({
                    colors: { ...customization.colors, text: e.target.value }
                  })}
                  className="w-full h-8 rounded border border-[#3a3a3a] bg-[#1a1a1a] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Typography Section */}
      <div className="space-y-3">
        <SectionHeader section="typography" icon={Type} title="Typography" />
        {expandedSections.has('typography') && (
          <div className="space-y-4 pl-4">
            {/* Typography Presets */}
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Font Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(TYPOGRAPHY_PRESETS).map(([name, preset]) => (
                  <button
                    key={name}
                    onClick={() => applyTypographyPreset(name as keyof typeof TYPOGRAPHY_PRESETS)}
                    className="p-2 bg-[#1a1a1a] hover:bg-[#3a3a3a] rounded-lg transition-colors text-left border border-[#3a3a3a] hover:border-[#cc785c]/50"
                  >
                    <div className="text-xs text-[#f5f5f5] capitalize">{name}</div>
                    <div className="text-xs text-[#a3a3a3]" style={{ fontFamily: preset.fontFamily }}>
                      {preset.fontFamily.split(',')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Controls */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Title Size</label>
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={customization.typography.fontSize.title}
                  onChange={(e) => updateCustomization({
                    typography: {
                      ...customization.typography,
                      fontSize: {
                        ...customization.typography.fontSize,
                        title: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full accent-[#cc785c]"
                />
                <span className="text-xs text-[#a3a3a3]">{customization.typography.fontSize.title}px</span>
              </div>
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Labels Size</label>
                <input
                  type="range"
                  min="8"
                  max="20"
                  value={customization.typography.fontSize.labels}
                  onChange={(e) => updateCustomization({
                    typography: {
                      ...customization.typography,
                      fontSize: {
                        ...customization.typography.fontSize,
                        labels: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full accent-[#cc785c]"
                />
                <span className="text-xs text-[#a3a3a3]">{customization.typography.fontSize.labels}px</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Layout Section */}
      <div className="space-y-3">
        <SectionHeader section="layout" icon={Layout} title="Layout & Spacing" />
        {expandedSections.has('layout') && (
          <div className="space-y-4 pl-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Top Padding</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customization.layout.padding.top}
                  onChange={(e) => updateCustomization({
                    layout: {
                      padding: {
                        ...customization.layout.padding,
                        top: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full accent-[#cc785c]"
                />
                <span className="text-xs text-[#a3a3a3]">{customization.layout.padding.top}px</span>
              </div>
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Bottom Padding</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customization.layout.padding.bottom}
                  onChange={(e) => updateCustomization({
                    layout: {
                      padding: {
                        ...customization.layout.padding,
                        bottom: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full accent-[#cc785c]"
                />
                <span className="text-xs text-[#a3a3a3]">{customization.layout.padding.bottom}px</span>
              </div>
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Left Padding</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customization.layout.padding.left}
                  onChange={(e) => updateCustomization({
                    layout: {
                      padding: {
                        ...customization.layout.padding,
                        left: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full accent-[#cc785c]"
                />
                <span className="text-xs text-[#a3a3a3]">{customization.layout.padding.left}px</span>
              </div>
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Right Padding</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customization.layout.padding.right}
                  onChange={(e) => updateCustomization({
                    layout: {
                      padding: {
                        ...customization.layout.padding,
                        right: parseInt(e.target.value)
                      }
                    }
                  })}
                  className="w-full accent-[#cc785c]"
                />
                <span className="text-xs text-[#a3a3a3]">{customization.layout.padding.right}px</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animations Section */}
      <div className="space-y-3">
        <SectionHeader section="animations" icon={Zap} title="Animations" />
        {expandedSections.has('animations') && (
          <div className="space-y-4 pl-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#f5f5f5]">Enable Animations</label>
              <input
                type="checkbox"
                checked={customization.animations.enabled}
                onChange={(e) => updateCustomization({
                  animations: {
                    ...customization.animations,
                    enabled: e.target.checked
                  }
                })}
                className="rounded bg-[#1a1a1a] border-[#3a3a3a] text-[#cc785c] focus:ring-[#cc785c] accent-[#cc785c]"
              />
            </div>
            
            {customization.animations.enabled && (
              <>
                <div>
                  <label className="block text-xs text-[#a3a3a3] mb-1">Duration (ms)</label>
                  <input
                    type="range"
                    min="200"
                    max="3000"
                    step="100"
                    value={customization.animations.duration}
                    onChange={(e) => updateCustomization({
                      animations: {
                        ...customization.animations,
                        duration: parseInt(e.target.value)
                      }
                    })}
                    className="w-full accent-[#cc785c]"
                  />
                  <span className="text-xs text-[#a3a3a3]">{customization.animations.duration}ms</span>
                </div>
                
                <div>
                  <label className="block text-xs text-[#a3a3a3] mb-1">Easing</label>
                  <select
                    value={customization.animations.easing}
                    onChange={(e) => updateCustomization({
                      animations: {
                        ...customization.animations,
                        easing: e.target.value as any
                      }
                    })}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] text-[#f5f5f5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc785c] transition-all duration-300"
                  >
                    <option value="linear">Linear</option>
                    <option value="easeInQuad">Ease In Quad</option>
                    <option value="easeOutQuad">Ease Out Quad</option>
                    <option value="easeInOutQuad">Ease In Out Quad</option>
                    <option value="easeInCubic">Ease In Cubic</option>
                    <option value="easeOutCubic">Ease Out Cubic</option>
                    <option value="easeInOutCubic">Ease In Out Cubic</option>
                    <option value="easeInQuart">Ease In Quart</option>
                    <option value="easeOutQuart">Ease Out Quart</option>
                    <option value="easeInOutQuart">Ease In Out Quart</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Export Section */}
      {onExport && (
        <div className="pt-6 border-t border-[#3a3a3a]">
          <h4 className="text-lg font-medium text-[#f5f5f5] mb-4">Export Your Chart</h4>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onExport('png')}
              className="px-4 py-3 bg-[#cc785c] text-white rounded-lg hover:bg-[#b8694f] text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>PNG</span>
            </button>
            <button
              onClick={() => onExport('jpg')}
              className="px-4 py-3 bg-[#cc785c] text-white rounded-lg hover:bg-[#b8694f] text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>JPG</span>
            </button>
            <button
              onClick={() => onExport('svg')}
              className="px-4 py-3 bg-[#cc785c] text-white rounded-lg hover:bg-[#b8694f] text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>SVG</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChartCustomizationPanel