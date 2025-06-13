import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import '@testing-library/jest-dom'
import { ChartCustomizationPanel } from '@/components/ChartCustomizationPanel'
import { ChartConfig } from '@/types/chart'
import { DEFAULT_CUSTOMIZATION } from '@/lib/chartCustomization'

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

const mockOnConfigChange = vi.fn()
const mockOnExport = vi.fn()

describe('ChartCustomizationPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the customization panel', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
        onExport={mockOnExport}
      />
    )

    expect(screen.getByText('Customize Your Chart')).toBeInTheDocument()
    expect(screen.getByText('Choose Chart Type')).toBeInTheDocument()
  })

  it('should render all chart type options', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const chartTypes = ['Bar Chart', 'Line Chart', 'Pie Chart', 'Doughnut', 'Scatter Plot', 'Area Chart', 'Radar Chart', 'Polar Area', 'Bubble Chart']
    
    chartTypes.forEach(type => {
      expect(screen.getByText(type)).toBeInTheDocument()
    })
  })

  it('should highlight current chart type', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const barChartButton = screen.getByText('Bar Chart').closest('button')
    expect(barChartButton).toHaveClass('border-[#cc785c]')
  })

  it('should call onConfigChange when chart type is changed', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const lineChartButton = screen.getByText('Line Chart')
    fireEvent.click(lineChartButton)

    expect(mockOnConfigChange).toHaveBeenCalled()
    const call = mockOnConfigChange.mock.calls[0][0]
    expect(call.type).toBe('line')
  })

  it('should render chart title input with current value', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const titleInput = screen.getByDisplayValue('Test Chart')
    expect(titleInput).toBeInTheDocument()
  })

  it('should update chart title when input changes', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const titleInput = screen.getByDisplayValue('Test Chart')
    fireEvent.change(titleInput, { target: { value: 'New Chart Title' } })

    expect(mockOnConfigChange).toHaveBeenCalled()
    const call = mockOnConfigChange.mock.calls[0][0]
    expect(call.options.plugins.title.text).toBe('New Chart Title')
  })

  it('should render axis label inputs', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    expect(screen.getByDisplayValue('X Axis')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Y Axis')).toBeInTheDocument()
  })

  it('should expand and collapse sections', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    // Colors section should be expanded by default
    expect(screen.getByText('Color Palettes')).toBeInTheDocument()

    // Click to collapse colors section
    const colorsHeader = screen.getByText('Colors & Themes')
    fireEvent.click(colorsHeader)

    // Typography section should be collapsed by default
    const typographyHeader = screen.getByText('Typography')
    fireEvent.click(typographyHeader)

    expect(screen.getByText('Font Presets')).toBeInTheDocument()
  })

  it('should render color palette options', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    // Colors section is expanded by default
    expect(screen.getByText('default')).toBeInTheDocument()
    expect(screen.getByText('ocean')).toBeInTheDocument()
    expect(screen.getByText('sunset')).toBeInTheDocument()
  })

  it('should apply color palette when clicked', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const oceanPalette = screen.getByText('ocean')
    fireEvent.click(oceanPalette)

    expect(mockOnConfigChange).toHaveBeenCalled()
  })

  it('should render individual color controls', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    expect(screen.getByText('Primary Color')).toBeInTheDocument()
    expect(screen.getByText('Secondary Color')).toBeInTheDocument()
    expect(screen.getByText('Background')).toBeInTheDocument()
    expect(screen.getByText('Text Color')).toBeInTheDocument()
  })

  it('should update colors when color inputs change', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    // Find the primary color input by finding the color input after the "Primary Color" label
    const primaryColorInputs = screen.getAllByDisplayValue('#3b82f6') // Default primary color
    const primaryColorInput = primaryColorInputs[0] // First one should be primary
    fireEvent.change(primaryColorInput, { target: { value: '#ff0000' } })

    expect(mockOnConfigChange).toHaveBeenCalled()
  })

  it('should render typography section when expanded', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const typographyHeader = screen.getByText('Typography')
    fireEvent.click(typographyHeader)

    expect(screen.getByText('Font Presets')).toBeInTheDocument()
    expect(screen.getByText('modern')).toBeInTheDocument()
    expect(screen.getByText('classic')).toBeInTheDocument()
  })

  it('should apply typography preset when clicked', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const typographyHeader = screen.getByText('Typography')
    fireEvent.click(typographyHeader)

    const classicPreset = screen.getByText('classic')
    fireEvent.click(classicPreset)

    expect(mockOnConfigChange).toHaveBeenCalled()
  })

  it('should render font size controls when typography expanded', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const typographyHeader = screen.getByText('Typography')
    fireEvent.click(typographyHeader)

    expect(screen.getByText('Title Size')).toBeInTheDocument()
    expect(screen.getByText('Labels Size')).toBeInTheDocument()
  })

  it('should render layout section when expanded', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const layoutHeader = screen.getByText('Layout & Spacing')
    fireEvent.click(layoutHeader)

    expect(screen.getByText('Top Padding')).toBeInTheDocument()
    expect(screen.getByText('Bottom Padding')).toBeInTheDocument()
    expect(screen.getByText('Left Padding')).toBeInTheDocument()
    expect(screen.getByText('Right Padding')).toBeInTheDocument()
  })

  it('should render animations section when expanded', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const animationsHeader = screen.getByText('Animations')
    fireEvent.click(animationsHeader)

    expect(screen.getByText('Enable Animations')).toBeInTheDocument()
  })

  it('should show animation controls when animations enabled', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const animationsHeader = screen.getByText('Animations')
    fireEvent.click(animationsHeader)

    // Animations are enabled by default
    expect(screen.getByText('Duration (ms)')).toBeInTheDocument()
    expect(screen.getByText('Easing')).toBeInTheDocument()
  })

  it('should render export buttons when onExport provided', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
        onExport={mockOnExport}
      />
    )

    expect(screen.getByText('Export Your Chart')).toBeInTheDocument()
    expect(screen.getByText('PNG')).toBeInTheDocument()
    expect(screen.getByText('JPG')).toBeInTheDocument()
    expect(screen.getByText('SVG')).toBeInTheDocument()
  })

  it('should call onExport when export buttons clicked', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
        onExport={mockOnExport}
      />
    )

    const pngButton = screen.getByText('PNG')
    fireEvent.click(pngButton)

    expect(mockOnExport).toHaveBeenCalledWith('png')
  })

  it('should not render export section when onExport not provided', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    expect(screen.queryByText('Export Your Chart')).not.toBeInTheDocument()
  })

  it('should reset to defaults when reset button clicked', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const resetButton = screen.getByText('Reset All')
    fireEvent.click(resetButton)

    expect(mockOnConfigChange).toHaveBeenCalled()
  })

  it('should handle range input changes for typography', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const typographyHeader = screen.getByText('Typography')
    fireEvent.click(typographyHeader)

    const titleSizeRange = screen.getByDisplayValue('18') // Default title size
    fireEvent.change(titleSizeRange, { target: { value: '24' } })

    expect(mockOnConfigChange).toHaveBeenCalled()
  })

  it('should handle range input changes for layout', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const layoutHeader = screen.getByText('Layout & Spacing')
    fireEvent.click(layoutHeader)

    const topPaddingRanges = screen.getAllByDisplayValue('20') // Default padding values
    const topPaddingRange = topPaddingRanges[0] // First one should be top padding
    fireEvent.change(topPaddingRange, { target: { value: '30' } })

    expect(mockOnConfigChange).toHaveBeenCalled()
  })

  it('should handle animation checkbox toggle', () => {
    render(
      <ChartCustomizationPanel
        config={mockChartConfig}
        onConfigChange={mockOnConfigChange}
      />
    )

    const animationsHeader = screen.getByText('Animations')
    fireEvent.click(animationsHeader)

    const animationCheckbox = screen.getByRole('checkbox')
    fireEvent.click(animationCheckbox)

    expect(mockOnConfigChange).toHaveBeenCalled()
  })
})