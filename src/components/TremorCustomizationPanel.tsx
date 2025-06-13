import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Palette, Download, RefreshCw } from 'lucide-react'
import { ChartConfig } from '@/types/chart'
import { TREMOR_COLOR_PALETTES, TremorCustomizationService } from '@/lib/tremorCustomization'

interface TremorCustomizationPanelProps {
  config: ChartConfig
  onConfigChange: (newConfig: ChartConfig) => void
  onExport?: (format: 'png' | 'jpg' | 'svg') => void
}

type PanelSection = 'colors' | 'data' | 'export'

export const TremorCustomizationPanel: React.FC<TremorCustomizationPanelProps> = ({
  config,
  onConfigChange,
  onExport
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<PanelSection>>(new Set(['colors']))

  const toggleSection = (section: PanelSection) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const applyColorPalette = (paletteName: keyof typeof TREMOR_COLOR_PALETTES) => {
    console.log('🎨 Applying color palette:', paletteName)
    const palette = TREMOR_COLOR_PALETTES[paletteName]
    
    // Update the datasets with new colors from the palette
    const newDatasets = config.data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: Array.isArray(dataset.backgroundColor) 
        ? palette.map(color => TremorCustomizationService.tremorColorToHex(color))
        : TremorCustomizationService.tremorColorToHex(palette[index % palette.length])
    }))
    
    const newConfig = {
      ...config,
      data: {
        ...config.data,
        datasets: newDatasets
      },
      customization: {
        ...config.customization,
        colors: {
          ...config.customization.colors,
          primary: TremorCustomizationService.tremorColorToHex(palette[0]),
          secondary: TremorCustomizationService.tremorColorToHex(palette[1]),
          accent: TremorCustomizationService.tremorColorToHex(palette[2])
        }
      }
    }
    
    console.log('🎨 Applied palette config:', newConfig)
    onConfigChange(newConfig)
  }

  const resetToDefaults = () => {
    const defaultConfig = {
      ...config,
      customization: {
        colors: {
          primary: '#3b82f6',
          secondary: '#ef4444',
          accent: '#10b981',
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
    onConfigChange(defaultConfig)
  }

  const changeChartType = (newType: string) => {
    console.log('📊 Changing chart type to:', newType)
    const newConfig = {
      ...config,
      type: newType as any
    }
    onConfigChange(newConfig)
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

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-[#3a3a3a] overflow-hidden">
      <div className="p-6 border-b border-[#3a3a3a]">
        <h3 className="text-xl font-medium text-[#f5f5f5] mb-2">Chart Customization</h3>
        <p className="text-sm text-[#a3a3a3]">Customize your chart appearance and behavior</p>
      </div>

      {/* Colors Section */}
      <div>
        <SectionHeader
          title="Color Palettes"
          icon={<Palette className="w-4 h-4 text-[#cc785c]" />}
          section="colors"
        />
        {expandedSections.has('colors') && (
          <div className="p-4 bg-[#1a1a1a]">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(TREMOR_COLOR_PALETTES).map(([name, colors]) => (
                <button
                  key={name}
                  onClick={() => applyColorPalette(name as keyof typeof TREMOR_COLOR_PALETTES)}
                  className="group p-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg border border-[#3a3a3a] hover:border-[#cc785c]/50 transition-all"
                >
                  <div className="flex space-x-1 mb-2">
                    {colors.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className={`w-4 h-4 rounded-full ${
                          color === 'blue' ? 'bg-blue-500' :
                          color === 'red' ? 'bg-red-500' :
                          color === 'emerald' ? 'bg-emerald-500' :
                          color === 'violet' ? 'bg-violet-500' :
                          color === 'amber' ? 'bg-amber-500' :
                          color === 'rose' ? 'bg-rose-500' :
                          color === 'cyan' ? 'bg-cyan-500' :
                          color === 'orange' ? 'bg-orange-500' :
                          color === 'lime' ? 'bg-lime-500' :
                          color === 'green' ? 'bg-green-500' :
                          color === 'slate' ? 'bg-slate-500' :
                          color === 'gray' ? 'bg-gray-500' :
                          'bg-blue-500'
                        }`}
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

      {/* Chart Type Section */}
      <div>
        <SectionHeader
          title="Chart Type"
          icon={<RefreshCw className="w-4 h-4 text-[#cc785c]" />}
          section="data"
        />
        {expandedSections.has('data') && (
          <div className="p-4 bg-[#1a1a1a]">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bar', label: 'Bar Chart', icon: '📊' },
                { id: 'line', label: 'Line Chart', icon: '📈' },
                { id: 'area', label: 'Area Chart', icon: '🏔️' },
                { id: 'pie', label: 'Pie Chart', icon: '🥧' },
                { id: 'doughnut', label: 'Donut Chart', icon: '🍩' },
                { id: 'scatter', label: 'Scatter Plot', icon: '⚫' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => changeChartType(type.id)}
                  className={`p-3 text-xs rounded-lg border transition-all text-center ${
                    config.type === type.id
                      ? 'bg-[#cc785c] border-[#cc785c] text-white'
                      : 'bg-[#2a2a2a] border-[#3a3a3a] text-[#a3a3a3] hover:border-[#cc785c]/50 hover:text-[#f5f5f5]'
                  }`}
                >
                  <div className="text-sm mb-1">{type.icon}</div>
                  <div className="text-xs">{type.label}</div>
                </button>
              ))}
            </div>
            
            {/* Chart Options */}
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-[#f5f5f5]">Chart Options</h4>
              
              {/* Stack Option for Bar/Area charts */}
              {(config.type === 'bar' || config.type === 'area') && (
                <div className="flex items-center justify-between">
                  <label className="text-xs text-[#a3a3a3]">Stack Series</label>
                  <input
                    type="checkbox"
                    checked={config.options?.scales?.x?.stacked || false}
                    onChange={(e) => {
                      const newConfig = {
                        ...config,
                        options: {
                          ...config.options,
                          scales: {
                            ...config.options?.scales,
                            x: { ...config.options?.scales?.x, stacked: e.target.checked },
                            y: { ...config.options?.scales?.y, stacked: e.target.checked }
                          }
                        }
                      }
                      onConfigChange(newConfig)
                    }}
                    className="rounded bg-[#1a1a1a] border-[#3a3a3a] text-[#cc785c] focus:ring-[#cc785c] accent-[#cc785c]"
                  />
                </div>
              )}
              
              {/* Show Legend Option */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-[#a3a3a3]">Show Legend</label>
                <input
                  type="checkbox"
                  checked={config.options?.plugins?.legend?.display ?? true}
                  onChange={(e) => {
                    const newConfig = {
                      ...config,
                      options: {
                        ...config.options,
                        plugins: {
                          ...config.options?.plugins,
                          legend: { ...config.options?.plugins?.legend, display: e.target.checked }
                        }
                      }
                    }
                    onConfigChange(newConfig)
                  }}
                  className="rounded bg-[#1a1a1a] border-[#3a3a3a] text-[#cc785c] focus:ring-[#cc785c] accent-[#cc785c]"
                />
              </div>
              
              {/* Show Grid Lines Option */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-[#a3a3a3]">Show Grid Lines</label>
                <input
                  type="checkbox"
                  checked={config.options?.scales?.x?.grid?.display ?? true}
                  onChange={(e) => {
                    const newConfig = {
                      ...config,
                      options: {
                        ...config.options,
                        scales: {
                          ...config.options?.scales,
                          x: { 
                            ...config.options?.scales?.x, 
                            grid: { ...config.options?.scales?.x?.grid, display: e.target.checked }
                          },
                          y: { 
                            ...config.options?.scales?.y, 
                            grid: { ...config.options?.scales?.y?.grid, display: e.target.checked }
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

            <button
              onClick={resetToDefaults}
              className="w-full mt-4 p-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#a3a3a3] hover:text-[#f5f5f5] rounded-lg border border-[#3a3a3a] hover:border-[#cc785c]/50 transition-all text-sm"
            >
              Reset to Defaults
            </button>
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
            <div className="grid grid-cols-3 gap-2">
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
          </div>
        )}
      </div>
    </div>
  )
}

export default TremorCustomizationPanel