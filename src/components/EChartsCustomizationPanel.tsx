import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Palette, Type, Layout, Zap, Download, RefreshCw, Settings, BarChart3, LineChart, PieChart, Radar, Gauge, TrendingUp } from 'lucide-react'
import { ChartConfig } from '@/types/chart'
import { ECHARTS_COLOR_PALETTES } from '@/lib/echartsDataTransforms'
import { EChartsCustomizationService } from '@/lib/echartsCustomization'

interface EChartsCustomizationPanelProps {
  config: ChartConfig
  onConfigChange: (newConfig: ChartConfig) => void
  onExport?: (format: 'png' | 'jpg' | 'svg') => void
}

type PanelSection = 'colors' | 'charts' | 'styling' | 'interaction' | 'animation' | 'export'

export const EChartsCustomizationPanel: React.FC<EChartsCustomizationPanelProps> = ({
  config,
  onConfigChange,
  onExport
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<PanelSection>>(new Set(['colors', 'charts']))

  const toggleSection = (section: PanelSection) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const applyColorPalette = (paletteName: keyof typeof ECHARTS_COLOR_PALETTES) => {
    console.log('🎨 Applying ECharts color palette:', paletteName)
    const newConfig = EChartsCustomizationService.applyColorPalette(config, paletteName)
    onConfigChange(newConfig)
  }

  const changeChartType = (newType: string) => {
    console.log('📊 Changing chart type to:', newType)
    const newConfig = {
      ...config,
      type: newType as any
    }
    onConfigChange(newConfig)
  }

  const updateCustomization = (updates: any) => {
    const newConfig = {
      ...config,
      customization: {
        ...config.customization,
        ...updates
      }
    }
    onConfigChange(newConfig)
  }

  const resetToDefaults = () => {
    const defaultConfig = {
      ...config,
      customization: {
        colors: {
          primary: '#5470c6',
          secondary: '#91cc75',
          accent: '#fac858',
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
    onConfigChange(defaultConfig)
  }

  const SectionHeader: React.FC<{ 
    title: string
    icon: React.ReactNode
    section: PanelSection
  }> = ({ title, icon, section }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors border-b border-[#3a3a3a]"
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span className="font-medium text-[#f5f5f5]">{title}</span>
      </div>
      {expandedSections.has(section) ? (
        <ChevronUp className="w-4 h-4 text-[#a3a3a3]" />
      ) : (
        <ChevronDown className="w-4 h-4 text-[#a3a3a3]" />
      )}
    </button>
  )

  const CHART_TYPES = [
    { id: 'bar', label: 'Bar Chart', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'line', label: 'Line Chart', icon: <LineChart className="w-4 h-4" /> },
    { id: 'area', label: 'Area Chart', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'pie', label: 'Pie Chart', icon: <PieChart className="w-4 h-4" /> },
    { id: 'doughnut', label: 'Donut Chart', icon: <PieChart className="w-4 h-4" /> },
    { id: 'scatter', label: 'Scatter Plot', icon: <div className="w-4 h-4 bg-blue-500 rounded-full" /> },
    { id: 'radar', label: 'Radar Chart', icon: <Radar className="w-4 h-4" /> },
    { id: 'gauge', label: 'Gauge Chart', icon: <Gauge className="w-4 h-4" /> },
    { id: 'funnel', label: 'Funnel Chart', icon: <div className="w-4 h-4 bg-purple-500" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} /> },
    { id: 'heatmap', label: 'Heatmap', icon: <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-red-500" /> },
    { id: 'treemap', label: 'Treemap', icon: <div className="w-4 h-4 grid grid-cols-2 gap-1"><div className="bg-green-500"></div><div className="bg-blue-500"></div><div className="bg-red-500"></div><div className="bg-yellow-500"></div></div> },
    { id: 'sunburst', label: 'Sunburst', icon: <div className="w-4 h-4 bg-orange-500 rounded-full relative"><div className="absolute inset-1 bg-yellow-500 rounded-full"></div></div> }
  ]

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-[#3a3a3a] overflow-hidden">
      <div className="p-6 border-b border-[#3a3a3a]">
        <h3 className="text-xl font-medium text-[#f5f5f5] mb-2">ECharts Customization</h3>
        <p className="text-sm text-[#a3a3a3]">Powerful chart customization with Apache ECharts</p>
      </div>

      {/* Color Palettes Section */}
      <div>
        <SectionHeader
          title="Color Palettes"
          icon={<Palette className="w-4 h-4 text-[#cc785c]" />}
          section="colors"
        />
        {expandedSections.has('colors') && (
          <div className="p-4 bg-[#1a1a1a]">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(ECHARTS_COLOR_PALETTES).map(([name, colors]) => (
                <button
                  key={name}
                  onClick={() => applyColorPalette(name as keyof typeof ECHARTS_COLOR_PALETTES)}
                  className="group p-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg border border-[#3a3a3a] hover:border-[#cc785c]/50 transition-all"
                >
                  <div className="flex space-x-1 mb-2">
                    {colors.slice(0, 6).map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#a3a3a3] group-hover:text-[#f5f5f5] capitalize">
                    {name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chart Types Section */}
      <div>
        <SectionHeader
          title="Chart Types"
          icon={<BarChart3 className="w-4 h-4 text-[#cc785c]" />}
          section="charts"
        />
        {expandedSections.has('charts') && (
          <div className="p-4 bg-[#1a1a1a]">
            <div className="grid grid-cols-3 gap-2">
              {CHART_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => changeChartType(type.id)}
                  className={`p-3 text-xs rounded-lg border transition-all text-center ${
                    config.type === type.id
                      ? 'bg-[#cc785c] border-[#cc785c] text-white'
                      : 'bg-[#2a2a2a] border-[#3a3a3a] text-[#a3a3a3] hover:border-[#cc785c]/50 hover:text-[#f5f5f5]'
                  }`}
                >
                  <div className="flex justify-center mb-1">{type.icon}</div>
                  <div className="text-xs">{type.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Styling Options */}
      <div>
        <SectionHeader
          title="Styling & Layout"
          icon={<Layout className="w-4 h-4 text-[#cc785c]" />}
          section="styling"
        />
        {expandedSections.has('styling') && (
          <div className="p-4 bg-[#1a1a1a] space-y-4">
            
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {['light', 'dark', 'business', 'vibrant'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => updateCustomization({ theme })}
                    className={`p-2 text-xs rounded border transition-all ${
                      config.customization.theme === theme
                        ? 'bg-[#cc785c] border-[#cc785c] text-white'
                        : 'bg-[#2a2a2a] border-[#3a3a3a] text-[#a3a3a3] hover:border-[#cc785c]/50'
                    }`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-xs text-[#a3a3a3] mb-1">Border Radius</label>
              <input
                type="range"
                min="0"
                max="20"
                value={config.customization.borderRadius || 0}
                onChange={(e) => updateCustomization({ borderRadius: parseInt(e.target.value) })}
                className="w-full accent-[#cc785c]"
              />
              <span className="text-xs text-[#a3a3a3]">{config.customization.borderRadius || 0}px</span>
            </div>

            {/* Symbol Size for scatter/line charts */}
            {(config.type === 'scatter' || config.type === 'line') && (
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Point Size</label>
                <input
                  type="range"
                  min="4"
                  max="20"
                  value={config.customization.symbolSize || 8}
                  onChange={(e) => updateCustomization({ symbolSize: parseInt(e.target.value) })}
                  className="w-full accent-[#cc785c]"
                />
                <span className="text-xs text-[#a3a3a3]">{config.customization.symbolSize || 8}px</span>
              </div>
            )}

            {/* Line Width for line/area charts */}
            {(config.type === 'line' || config.type === 'area') && (
              <div>
                <label className="block text-xs text-[#a3a3a3] mb-1">Line Width</label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={config.customization.line?.width || 2}
                  onChange={(e) => updateCustomization({ 
                    line: { ...config.customization.line, width: parseInt(e.target.value) }
                  })}
                  className="w-full accent-[#cc785c]"
                />
                <span className="text-xs text-[#a3a3a3]">{config.customization.line?.width || 2}px</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interaction Options */}
      <div>
        <SectionHeader
          title="Interaction & Features"
          icon={<Settings className="w-4 h-4 text-[#cc785c]" />}
          section="interaction"
        />
        {expandedSections.has('interaction') && (
          <div className="p-4 bg-[#1a1a1a] space-y-3">
            
            {/* Stacked option for bar/area charts */}
            {(config.type === 'bar' || config.type === 'area') && (
              <div className="flex items-center justify-between">
                <label className="text-xs text-[#a3a3a3]">Stack Series</label>
                <input
                  type="checkbox"
                  checked={config.customization.stacked || false}
                  onChange={(e) => updateCustomization({ stacked: e.target.checked })}
                  className="rounded bg-[#1a1a1a] border-[#3a3a3a] text-[#cc785c] focus:ring-[#cc785c] accent-[#cc785c]"
                />
              </div>
            )}

            {/* Smooth curves for line/area charts */}
            {(config.type === 'line' || config.type === 'area') && (
              <div className="flex items-center justify-between">
                <label className="text-xs text-[#a3a3a3]">Smooth Curves</label>
                <input
                  type="checkbox"
                  checked={config.customization.curves?.enabled || false}
                  onChange={(e) => updateCustomization({ 
                    curves: { enabled: e.target.checked }
                  })}
                  className="rounded bg-[#1a1a1a] border-[#3a3a3a] text-[#cc785c] focus:ring-[#cc785c] accent-[#cc785c]"
                />
              </div>
            )}

            {/* Data Labels */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-[#a3a3a3]">Show Data Labels</label>
              <input
                type="checkbox"
                checked={config.customization.dataLabels?.enabled || false}
                onChange={(e) => updateCustomization({ 
                  dataLabels: { enabled: e.target.checked }
                })}
                className="rounded bg-[#1a1a1a] border-[#3a3a3a] text-[#cc785c] focus:ring-[#cc785c] accent-[#cc785c]"
              />
            </div>

            {/* Show Legend */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-[#a3a3a3]">Show Legend</label>
              <input
                type="checkbox"
                checked={config.options?.plugins?.legend?.display !== false}
                onChange={(e) => {
                  const newConfig = {
                    ...config,
                    options: {
                      ...config.options,
                      plugins: {
                        ...config.options?.plugins,
                        legend: { 
                          ...config.options?.plugins?.legend, 
                          display: e.target.checked 
                        }
                      }
                    }
                  }
                  onConfigChange(newConfig)
                }}
                className="rounded bg-[#1a1a1a] border-[#3a3a3a] text-[#cc785c] focus:ring-[#cc785c] accent-[#cc785c]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Animation Options */}
      <div>
        <SectionHeader
          title="Animations"
          icon={<Zap className="w-4 h-4 text-[#cc785c]" />}
          section="animation"
        />
        {expandedSections.has('animation') && (
          <div className="p-4 bg-[#1a1a1a] space-y-4">
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#f5f5f5]">Enable Animations</label>
              <input
                type="checkbox"
                checked={config.customization.animations?.enabled !== false}
                onChange={(e) => updateCustomization({
                  animations: {
                    ...config.customization.animations,
                    enabled: e.target.checked
                  }
                })}
                className="rounded bg-[#1a1a1a] border-[#3a3a3a] text-[#cc785c] focus:ring-[#cc785c] accent-[#cc785c]"
              />
            </div>
            
            {config.customization.animations?.enabled !== false && (
              <>
                <div>
                  <label className="block text-xs text-[#a3a3a3] mb-1">Duration (ms)</label>
                  <input
                    type="range"
                    min="200"
                    max="3000"
                    step="100"
                    value={config.customization.animations?.duration || 1000}
                    onChange={(e) => updateCustomization({
                      animations: {
                        ...config.customization.animations,
                        duration: parseInt(e.target.value)
                      }
                    })}
                    className="w-full accent-[#cc785c]"
                  />
                  <span className="text-xs text-[#a3a3a3]">{config.customization.animations?.duration || 1000}ms</span>
                </div>
                
                <div>
                  <label className="block text-xs text-[#a3a3a3] mb-1">Easing</label>
                  <select
                    value={config.customization.animations?.easing || 'cubicOut'}
                    onChange={(e) => updateCustomization({
                      animations: {
                        ...config.customization.animations,
                        easing: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#3a3a3a] text-[#f5f5f5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc785c] transition-all duration-300"
                  >
                    <option value="linear">Linear</option>
                    <option value="quadraticIn">Quadratic In</option>
                    <option value="quadraticOut">Quadratic Out</option>
                    <option value="cubicIn">Cubic In</option>
                    <option value="cubicOut">Cubic Out</option>
                    <option value="elasticOut">Elastic Out</option>
                    <option value="bounceOut">Bounce Out</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Export Section */}
      <div>
        <SectionHeader
          title="Export Chart"
          icon={<Download className="w-4 h-4 text-[#cc785c]" />}
          section="export"
        />
        {expandedSections.has('export') && onExport && (
          <div className="p-4 bg-[#1a1a1a]">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['png', 'jpg', 'svg'].map((format) => (
                <button
                  key={format}
                  onClick={() => onExport(format as any)}
                  className="p-3 bg-[#2a2a2a] hover:bg-[#cc785c] text-[#a3a3a3] hover:text-white rounded-lg border border-[#3a3a3a] hover:border-[#cc785c] transition-all text-sm font-medium"
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
            
            <button
              onClick={resetToDefaults}
              className="w-full p-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#a3a3a3] hover:text-[#f5f5f5] rounded-lg border border-[#3a3a3a] hover:border-[#cc785c]/50 transition-all text-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Defaults
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EChartsCustomizationPanel