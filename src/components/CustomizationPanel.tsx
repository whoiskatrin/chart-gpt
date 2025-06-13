import React, { useState } from 'react'
import { Palette, Type, Layout, Settings, Download, Sparkles } from 'lucide-react'
import { ChartCustomization, ChartConfig } from '@/types/chart'
import { COLOR_PALETTES, TYPOGRAPHY_PRESETS, ChartCustomizationService } from '@/lib/chartCustomization'

interface CustomizationPanelProps {
  config: ChartConfig
  onConfigChange: (config: ChartConfig) => void
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  config,
  onConfigChange
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'animation'>('colors')

  const handleCustomizationChange = (updates: Partial<ChartCustomization>) => {
    const newConfig = ChartCustomizationService.applyCustomization(config, updates)
    onConfigChange(newConfig)
  }

  const ColorTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color Palette</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(COLOR_PALETTES).map(([name, colors]) => (
            <button
              key={name}
              onClick={() => handleCustomizationChange({
                colors: {
                  ...config.customization.colors,
                  primary: colors[0],
                  secondary: colors[1],
                  accent: colors[2]
                }
              })}
              className="p-2 border rounded-lg hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            >
              <div className="flex space-x-1 mb-1">
                {colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-600 capitalize">{name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
          <input
            type="color"
            value={config.customization.colors.primary}
            onChange={(e) => handleCustomizationChange({
              colors: { ...config.customization.colors, primary: e.target.value }
            })}
            className="w-full h-10 border border-gray-300 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
          <input
            type="color"
            value={config.customization.colors.secondary}
            onChange={(e) => handleCustomizationChange({
              colors: { ...config.customization.colors, secondary: e.target.value }
            })}
            className="w-full h-10 border border-gray-300 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
          <input
            type="color"
            value={config.customization.colors.background}
            onChange={(e) => handleCustomizationChange({
              colors: { ...config.customization.colors, background: e.target.value }
            })}
            className="w-full h-10 border border-gray-300 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
          <input
            type="color"
            value={config.customization.colors.text}
            onChange={(e) => handleCustomizationChange({
              colors: { ...config.customization.colors, text: e.target.value }
            })}
            className="w-full h-10 border border-gray-300 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  )

  const TypographyTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Typography Preset</label>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(TYPOGRAPHY_PRESETS).map(([name, preset]) => (
            <button
              key={name}
              onClick={() => handleCustomizationChange({ typography: preset })}
              className={`p-3 border rounded-lg text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                config.customization.typography.fontFamily === preset.fontFamily ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="font-medium capitalize" style={{ fontFamily: preset.fontFamily }}>
                {name}
              </div>
              <div className="text-sm text-gray-600">{preset.fontFamily}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Custom Font Family</label>
        <input
          type="text"
          value={config.customization.typography.fontFamily}
          onChange={(e) => handleCustomizationChange({
            typography: { ...config.customization.typography, fontFamily: e.target.value }
          })}
          placeholder="e.g., Arial, sans-serif"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title Size</label>
          <input
            type="number"
            value={config.customization.typography.fontSize.title}
            onChange={(e) => handleCustomizationChange({
              typography: {
                ...config.customization.typography,
                fontSize: { ...config.customization.typography.fontSize, title: parseInt(e.target.value) }
              }
            })}
            min="10"
            max="32"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Labels Size</label>
          <input
            type="number"
            value={config.customization.typography.fontSize.labels}
            onChange={(e) => handleCustomizationChange({
              typography: {
                ...config.customization.typography,
                fontSize: { ...config.customization.typography.fontSize, labels: parseInt(e.target.value) }
              }
            })}
            min="8"
            max="20"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Legend Size</label>
          <input
            type="number"
            value={config.customization.typography.fontSize.legend}
            onChange={(e) => handleCustomizationChange({
              typography: {
                ...config.customization.typography,
                fontSize: { ...config.customization.typography.fontSize, legend: parseInt(e.target.value) }
              }
            })}
            min="8"
            max="20"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )

  const LayoutTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Top</label>
            <input
              type="number"
              value={config.customization.layout.padding.top}
              onChange={(e) => handleCustomizationChange({
                layout: {
                  ...config.customization.layout,
                  padding: { ...config.customization.layout.padding, top: parseInt(e.target.value) }
                }
              })}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Right</label>
            <input
              type="number"
              value={config.customization.layout.padding.right}
              onChange={(e) => handleCustomizationChange({
                layout: {
                  ...config.customization.layout,
                  padding: { ...config.customization.layout.padding, right: parseInt(e.target.value) }
                }
              })}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Bottom</label>
            <input
              type="number"
              value={config.customization.layout.padding.bottom}
              onChange={(e) => handleCustomizationChange({
                layout: {
                  ...config.customization.layout,
                  padding: { ...config.customization.layout.padding, bottom: parseInt(e.target.value) }
                }
              })}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Left</label>
            <input
              type="number"
              value={config.customization.layout.padding.left}
              onChange={(e) => handleCustomizationChange({
                layout: {
                  ...config.customization.layout,
                  padding: { ...config.customization.layout.padding, left: parseInt(e.target.value) }
                }
              })}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={config.customization.responsive.enabled}
            onChange={(e) => handleCustomizationChange({
              responsive: { ...config.customization.responsive, enabled: e.target.checked }
            })}
            className="rounded"
          />
          <span className="text-sm font-medium text-gray-700">Enable Responsive Design</span>
        </label>
      </div>

      {config.customization.responsive.enabled && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Breakpoints (px)</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Mobile</label>
              <input
                type="number"
                value={config.customization.responsive.breakpoints.mobile}
                onChange={(e) => handleCustomizationChange({
                  responsive: {
                    ...config.customization.responsive,
                    breakpoints: { ...config.customization.responsive.breakpoints, mobile: parseInt(e.target.value) }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tablet</label>
              <input
                type="number"
                value={config.customization.responsive.breakpoints.tablet}
                onChange={(e) => handleCustomizationChange({
                  responsive: {
                    ...config.customization.responsive,
                    breakpoints: { ...config.customization.responsive.breakpoints, tablet: parseInt(e.target.value) }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Desktop</label>
              <input
                type="number"
                value={config.customization.responsive.breakpoints.desktop}
                onChange={(e) => handleCustomizationChange({
                  responsive: {
                    ...config.customization.responsive,
                    breakpoints: { ...config.customization.responsive.breakpoints, desktop: parseInt(e.target.value) }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const AnimationTab = () => (
    <div className="space-y-4">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={config.customization.animations.enabled}
            onChange={(e) => handleCustomizationChange({
              animations: { ...config.customization.animations, enabled: e.target.checked }
            })}
            className="rounded"
          />
          <span className="text-sm font-medium text-gray-700">Enable Animations</span>
        </label>
      </div>

      {config.customization.animations.enabled && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (ms)</label>
            <input
              type="range"
              min="200"
              max="3000"
              step="100"
              value={config.customization.animations.duration}
              onChange={(e) => handleCustomizationChange({
                animations: { ...config.customization.animations, duration: parseInt(e.target.value) }
              })}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">{config.customization.animations.duration}ms</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Easing</label>
            <select
              value={config.customization.animations.easing}
              onChange={(e) => handleCustomizationChange({
                animations: { ...config.customization.animations, easing: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easeInOutQuart">Ease In Out Quart</option>
              <option value="easeOutBounce">Ease Out Bounce</option>
              <option value="easeInOutBack">Ease In Out Back</option>
              <option value="linear">Linear</option>
              <option value="easeInQuad">Ease In Quad</option>
              <option value="easeOutQuad">Ease Out Quad</option>
            </select>
          </div>
        </>
      )}
    </div>
  )

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'animation', label: 'Animation', icon: Settings },
  ] as const

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'colors' && <ColorTab />}
        {activeTab === 'typography' && <TypographyTab />}
        {activeTab === 'layout' && <LayoutTab />}
        {activeTab === 'animation' && <AnimationTab />}
      </div>
    </div>
  )
}

export default CustomizationPanel