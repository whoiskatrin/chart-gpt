import React from 'react'
import EChartsRenderer from './EChartsRenderer'
import { ChartConfig, ChartExportOptions } from '@/types/chart'

interface ChartRendererProps {
  config: ChartConfig
  width?: number
  height?: number
  className?: string
  onExport?: (options: ChartExportOptions) => void
  showControls?: boolean
  onDataPointClick?: (dataPoint: any) => void
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  config,
  width = 800,
  height = 400,
  className = '',
  onExport,
  showControls = false,
  onDataPointClick
}) => {
  return (
    <EChartsRenderer
      config={config}
      width={width}
      height={height}
      className={className}
      onExport={onExport}
      showControls={showControls}
      onDataPointClick={onDataPointClick}
      interactive={true}
      theme="light"
    />
  )
}

export default ChartRenderer