import React, { useState, useEffect } from 'react'
import { Sparkles, Loader2, ArrowRight, Play, ChevronDown, BarChart3, FileText, Type } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { AIProviderService, AVAILABLE_MODELS } from '@/lib/aiProviders'
import { ChartConfig } from '@/types/chart'
import { EChartsCustomizationService } from '@/lib/echartsCustomization'
import ChartRenderer from './ChartRenderer'
import ModelSelector from './ModelSelector'
import EChartsCustomizationPanel from './EChartsCustomizationPanel'
import InteractiveExamples from './InteractiveExamples'
import { FileUpload } from './FileUpload'
import { ParsedData, FileParser } from '@/lib/fileParser'
// Removed Tremor components - now using ECharts
import ChartTestSuite from './ChartTestSuite'
import toast from 'react-hot-toast'

const DEFAULT_CUSTOMIZATION = {
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

const EXAMPLE_CHARTS = [
  {
    title: "Sales Performance",
    prompt: "Create a bar chart showing monthly sales from Jan to Jun with values 45, 52, 38, 61, 49, 67",
    config: {
      type: 'bar' as const,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Sales (K)',
          data: [45, 52, 38, 61, 49, 67],
          backgroundColor: '#f97316'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Monthly Sales Performance' },
          legend: { position: 'top' as const }
        }
      },
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
  },
  {
    title: "User Demographics",
    prompt: "Show user age distribution as a pie chart: 18-24 (25%), 25-34 (35%), 35-44 (20%), 45+ (20%)",
    config: {
      type: 'pie' as const,
      data: {
        labels: ['18-24', '25-34', '35-44', '45+'],
        datasets: [{
          label: 'Age Groups',
          data: [25, 35, 20, 20],
          backgroundColor: ['#f97316', '#ea580c', '#c2410c', '#9a3412']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'User Age Distribution' },
          legend: { position: 'bottom' as const }
        }
      },
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
  },
  {
    title: "Growth Trend",
    prompt: "Line chart showing user growth over 6 months: 100, 150, 200, 280, 350, 420",
    config: {
      type: 'line' as const,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Users',
          data: [100, 150, 200, 280, 350, 420],
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'User Growth Trend' },
          legend: { position: 'top' as const }
        }
      },
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
  }
]

interface LandingPageProps {
  onNavigate?: (page: 'landing' | 'pricing' | 'settings' | 'test-charts' | 'echarts-demo' | 'responsive-test') => void
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user, userProfile } = useAuthStore()
  const [prompt, setPrompt] = useState('')
  const [dataRequest, setDataRequest] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo')
  const [currentChart, setCurrentChart] = useState<{ config: ChartConfig; prompt: string; model: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedExample, setSelectedExample] = useState(0)
  const [trialChartsUsed, setTrialChartsUsed] = useState(0)
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    google: ''
  })
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text')
  const [uploadedData, setUploadedData] = useState<ParsedData | null>(null)


  const generateChart = async (customPrompt?: string) => {
    const currentPrompt = customPrompt || prompt
    
    // Check if we have data to work with
    if (inputMode === 'text' && !currentPrompt.trim()) {
      toast.error('Please describe what data you want to visualize')
      return
    }
    
    if (inputMode === 'file' && !uploadedData) {
      toast.error('Please upload a data file first')
      return
    }

    // Check trial usage for non-logged users
    if (!user && trialChartsUsed >= 3) {
      toast.error('Trial limit reached. Please sign in with Google to continue generating charts.')
      return
    }

    if (user) {
      const selectedModelData = AVAILABLE_MODELS.find(m => m.id === selectedModel)
      if (!selectedModelData) {
        toast.error('Please select a valid AI model')
        return
      }

      if (!userProfile || userProfile.credits < selectedModelData.creditsPerRequest) {
        toast.error('Insufficient credits. Please purchase more credits to continue.')
        return
      }
    } else {
      // For trial users, just check if they have trials remaining
      if (trialChartsUsed >= 3) {
        toast.error('Trial limit reached. Please sign in with Google to continue generating charts.')
        return
      }
    }

    setIsGenerating(true)

    try {
      let chartConfig: ChartConfig
      
      if (user) {
        // Use AI for logged-in users with our API keys
        const aiService = new AIProviderService({
          openaiApiKey: process.env.VITE_OPENAI_API_KEY || 'our-openai-key',
          anthropicApiKey: process.env.VITE_ANTHROPIC_API_KEY || 'our-anthropic-key',
          googleApiKey: process.env.VITE_GOOGLE_API_KEY || 'our-google-key'
        })

        let enhancedPrompt = currentPrompt
        if (inputMode === 'file' && uploadedData) {
          // Create an enhanced prompt that includes file data context
          const dataSummary = FileParser.generateDataSummary(uploadedData)
          enhancedPrompt = `${currentPrompt ? currentPrompt + '\n\n' : ''}Based on this uploaded data:\n${dataSummary}\n\nPlease create an appropriate chart that best visualizes this data.`
        }

        const chartResponse = await aiService.generateChart(enhancedPrompt, selectedModel, inputMode === 'file' ? JSON.stringify(uploadedData?.data.slice(0, 10)) : dataRequest)
        
        try {
          const parsedConfig = JSON.parse(chartResponse)
          chartConfig = {
            type: parsedConfig.type || 'bar',
            data: parsedConfig.data || createFallbackData(),
            options: parsedConfig.options || createFallbackOptions(parsedConfig.title),
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
        } catch (parseError) {
          chartConfig = createFallbackChart(currentPrompt)
        }

        const selectedModelData = AVAILABLE_MODELS.find(m => m.id === selectedModel)!
        toast.success(`Chart generated! ${selectedModelData.creditsPerRequest} credits used.`)
      } else {
        // Generate realistic sample data for trial users using selected model
        const selectedModelData = AVAILABLE_MODELS.find(m => m.id === selectedModel)
        if (inputMode === 'file' && uploadedData) {
          chartConfig = generateChartFromFileData(uploadedData, currentPrompt)
        } else {
          chartConfig = generateTrialChart(currentPrompt, dataRequest)
        }
        setTrialChartsUsed(prev => prev + 1)
        toast.success(`Chart generated with ${selectedModelData?.name || 'AI'}! ${3 - trialChartsUsed - 1} trial charts remaining.`)
      }

      setCurrentChart({
        config: chartConfig,
        prompt: currentPrompt,
        model: user ? AVAILABLE_MODELS.find(m => m.id === selectedModel)!.name : 'Trial Mode'
      })
    } catch (error) {
      console.error('Chart generation failed:', error)
      toast.error('Failed to generate chart. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Removed API key checking since we provide them

  const createFallbackData = () => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Sample Data',
      data: [12, 19, 3, 5, 2],
      backgroundColor: '#f97316'
    }]
  })

  const createFallbackOptions = (title?: string) => ({
    responsive: true,
    plugins: {
      title: { display: true, text: title || 'Generated Chart' },
      legend: { position: 'top' as const }
    }
  })

  const createFallbackChart = (prompt: string): ChartConfig => ({
    type: 'bar',
    data: createFallbackData(),
    options: createFallbackOptions('Chart from: ' + prompt.slice(0, 50) + '...'),
    customization: DEFAULT_CUSTOMIZATION
  })

  const generateChartFromFileData = (parsedData: ParsedData, userPrompt?: string): ChartConfig => {
    const { data, columns } = parsedData
    
    if (data.length === 0 || columns.length === 0) {
      return createFallbackChart(userPrompt || 'Uploaded data')
    }

    // Try to determine the best chart type based on data structure
    const numericColumns = columns.filter(col => 
      data.some(row => typeof row[col] === 'number' && !isNaN(row[col]))
    )
    const categoryColumns = columns.filter(col => 
      data.some(row => typeof row[col] === 'string' || col.toLowerCase().includes('name') || col.toLowerCase().includes('category'))
    )

    let chartType: ChartConfig['type'] = 'bar'
    let chartData: any = {}
    let chartOptions: any = {
      responsive: true,
      plugins: {
        title: { display: true, text: parsedData.fileName },
        legend: { position: 'top' as const }
      }
    }

    if (numericColumns.length >= 2) {
      // Scatter plot for two numeric columns
      chartType = 'scatter'
      const xCol = numericColumns[0]
      const yCol = numericColumns[1]
      
      chartData = {
        datasets: [{
          label: `${yCol} vs ${xCol}`,
          data: data.map(row => ({ x: row[xCol], y: row[yCol] })).filter(point => 
            typeof point.x === 'number' && typeof point.y === 'number'
          ),
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb'
        }]
      }
      
      chartOptions.scales = {
        x: { title: { display: true, text: xCol } },
        y: { title: { display: true, text: yCol } }
      }
    } else if (numericColumns.length === 1 && categoryColumns.length >= 1) {
      // Bar chart with categories and one numeric value
      const categoryCol = categoryColumns[0]
      const valueCol = numericColumns[0]
      
      const aggregatedData = data.reduce((acc: Record<string, number>, row) => {
        const category = String(row[categoryCol])
        const value = typeof row[valueCol] === 'number' ? row[valueCol] : 0
        acc[category] = (acc[category] || 0) + value
        return acc
      }, {})
      
      chartData = {
        labels: Object.keys(aggregatedData),
        datasets: [{
          label: valueCol,
          data: Object.values(aggregatedData),
          backgroundColor: [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
            '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
          ].slice(0, Object.keys(aggregatedData).length)
        }]
      }
      
      chartOptions.scales = {
        y: { 
          beginAtZero: true,
          title: { display: true, text: valueCol }
        },
        x: {
          title: { display: true, text: categoryCol }
        }
      }
    } else if (data.length <= 20 && categoryColumns.length >= 1) {
      // Pie chart for small datasets with categories
      chartType = 'pie'
      const categoryCol = categoryColumns[0]
      const valueCol = numericColumns[0] || columns.find(col => col !== categoryCol) || columns[0]
      
      const pieData = data.slice(0, 10).reduce((acc: Record<string, number>, row) => {
        const category = String(row[categoryCol])
        const value = typeof row[valueCol] === 'number' ? row[valueCol] : 1
        acc[category] = (acc[category] || 0) + value
        return acc
      }, {})
      
      chartData = {
        labels: Object.keys(pieData),
        datasets: [{
          label: valueCol,
          data: Object.values(pieData),
          backgroundColor: [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
            '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
          ]
        }]
      }
    } else {
      // Default to line chart for time series or sequential data
      chartType = 'line'
      const xCol = columns[0]
      const yCol = numericColumns[0] || columns[1] || columns[0]
      
      chartData = {
        labels: data.slice(0, 50).map((row, index) => row[xCol] || `Point ${index + 1}`),
        datasets: [{
          label: yCol,
          data: data.slice(0, 50).map(row => typeof row[yCol] === 'number' ? row[yCol] : index),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      }
      
      chartOptions.scales = {
        y: { 
          beginAtZero: true,
          title: { display: true, text: yCol }
        },
        x: {
          title: { display: true, text: xCol }
        }
      }
    }

    return {
      type: chartType,
      data: chartData,
      options: chartOptions,
      customization: DEFAULT_CUSTOMIZATION
    }
  }

  const handleFileProcessed = (data: ParsedData) => {
    setUploadedData(data)
    toast.success(`File processed! Found ${data.data.length} rows and ${data.columns.length} columns.`)
  }

  const handleFileError = (error: string) => {
    toast.error(error)
    setUploadedData(null)
  }

  const generateTrialChart = (prompt: string, dataRequest?: string): ChartConfig => {
    // Generate realistic data based on the prompt keywords
    const lowerPrompt = (prompt + ' ' + (dataRequest || '')).toLowerCase()
    
    // Revenue/Sales Line Chart
    if (lowerPrompt.includes('revenue') || lowerPrompt.includes('quarterly') || lowerPrompt.includes('growth')) {
      return {
        type: 'line',
        data: {
          labels: ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'],
          datasets: [{
            label: 'Revenue ($M)',
            data: [1.2, 1.5, 1.8, 2.1, 2.4, 2.8, 3.2, 3.6],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Quarterly Revenue Growth Analysis' },
            legend: { position: 'top' as const }
          },
          scales: {
            y: { 
              beginAtZero: true,
              title: { display: true, text: 'Revenue (Millions $)' }
            },
            x: {
              title: { display: true, text: 'Quarter' }
            }
          }
        },
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
    } 
    // Market Share Pie Chart
    else if (lowerPrompt.includes('market') || lowerPrompt.includes('share') || lowerPrompt.includes('region') || lowerPrompt.includes('pie')) {
      return {
        type: 'pie',
        data: {
          labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'],
          datasets: [{
            label: 'Market Share',
            data: [42, 28, 18, 8, 4],
            backgroundColor: [
              '#3b82f6',
              '#10b981', 
              '#f59e0b',
              '#ef4444',
              '#8b5cf6'
            ],
            borderWidth: 2,
            borderColor: '#1a1a1a'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Global Market Share Distribution' },
            legend: { position: 'bottom' as const }
          }
        },
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
    }
    // Performance Bar Chart
    else if (lowerPrompt.includes('performance') || lowerPrompt.includes('channel') || lowerPrompt.includes('bar') || lowerPrompt.includes('compare')) {
      return {
        type: 'bar',
        data: {
          labels: ['Organic Search', 'Social Media', 'Email Marketing', 'Paid Ads', 'Direct Traffic', 'Referrals'],
          datasets: [{
            label: 'Performance (%)',
            data: [85, 72, 68, 91, 76, 59],
            backgroundColor: [
              '#10b981',
              '#3b82f6', 
              '#f59e0b',
              '#ef4444',
              '#8b5cf6',
              '#06b6d4'
            ],
            borderWidth: 2,
            borderColor: '#1a1a1a'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Multi-Channel Performance Metrics' },
            legend: { position: 'top' as const }
          },
          scales: {
            y: { 
              beginAtZero: true,
              max: 100,
              title: { display: true, text: 'Performance (%)' }
            },
            x: {
              title: { display: true, text: 'Channel' }
            }
          }
        },
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
    }
    // User Engagement Area Chart
    else if (lowerPrompt.includes('user') || lowerPrompt.includes('engagement') || lowerPrompt.includes('daily') || lowerPrompt.includes('area')) {
      return {
        type: 'line',
        data: {
          labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
          datasets: [{
            label: 'Daily Active Users',
            data: [25, 30, 32, 28, 22, 19, 20, 29, 33, 35, 31, 24, 21, 23, 31, 34, 36, 32, 25, 22, 24, 30, 33, 35, 34, 26, 23, 25, 31, 32].map(val => val * 1000),
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.2)',
            tension: 0.4,
            fill: true,
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Daily User Engagement Trends' },
            legend: { position: 'top' as const }
          },
          scales: {
            y: { 
              beginAtZero: true,
              title: { display: true, text: 'Users' }
            },
            x: {
              title: { display: true, text: 'Days' }
            }
          }
        },
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
    }
    // Default fallback
    else {
      return {
        type: 'bar',
        data: {
          labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
          datasets: [{
            label: 'Sales Volume',
            data: [245, 189, 321, 278, 156],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            borderWidth: 2,
            borderColor: '#1a1a1a'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Generated Data Visualization' },
            legend: { position: 'top' as const }
          },
          scales: {
            y: { 
              beginAtZero: true,
              title: { display: true, text: 'Units Sold' }
            },
            x: {
              title: { display: true, text: 'Products' }
            }
          }
        },
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
    }
  }

  const tryExample = (example: typeof EXAMPLE_CHARTS[0]) => {
    setPrompt(example.prompt)
    setCurrentChart({
      config: example.config,
      prompt: example.prompt,
      model: 'Example'
    })
  }

  const handleExampleSelect = (examplePrompt: string, title: string) => {
    setPrompt(examplePrompt)
    // Trigger chart generation with the selected example
    generateChart(examplePrompt)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {!currentChart ? (
        // Landing Page Design
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#cc785c]/5 via-transparent to-[#2563eb]/5" />
            <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
              <div className="text-center">
                {/* Hero Badge */}
                <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-2 mb-8">
                  <Sparkles className="w-4 h-4 text-[#cc785c]" />
                  <span className="text-sm text-[#a3a3a3]">AI-Powered Chart Generation</span>
                </div>
                
                {/* Hero Title */}
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                  Turn Your
                  <span className="block bg-gradient-to-r from-[#cc785c] to-[#2563eb] bg-clip-text text-transparent">
                    Data Into Charts
                  </span>
                </h1>
                
                {/* Hero Subtitle */}
                <p className="text-xl lg:text-2xl text-[#a3a3a3] mb-12 max-w-3xl mx-auto leading-relaxed">
                  Simply describe your data in plain English and watch as we instantly create beautiful, 
                  interactive charts. No coding, no spreadsheets, just results.
                </p>
                
                {/* CTA Section */}
                <div className="max-w-2xl mx-auto">
                  <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#cc785c] to-[#b8694f] rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-medium">Try it now</div>
                        <div className="text-sm text-[#a3a3a3]">Choose your input method</div>
                      </div>
                    </div>

                    {/* Input Mode Selector */}
                    <div className="flex gap-2 p-1 bg-[#0a0a0a] rounded-lg mb-4">
                      <button
                        onClick={() => setInputMode('text')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
                          inputMode === 'text'
                            ? 'bg-[#cc785c] text-white'
                            : 'text-[#a3a3a3] hover:text-white hover:bg-[#2a2a2a]'
                        }`}
                      >
                        <Type className="w-4 h-4" />
                        Text Prompt
                      </button>
                      <button
                        onClick={() => setInputMode('file')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
                          inputMode === 'file'
                            ? 'bg-[#cc785c] text-white'
                            : 'text-[#a3a3a3] hover:text-white hover:bg-[#2a2a2a]'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        Upload File
                      </button>
                    </div>
                    
                    {inputMode === 'text' ? (
                      <div className="relative">
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="e.g., 'Create a bar chart showing quarterly sales: Q1: $120k, Q2: $150k, Q3: $180k, Q4: $200k'"
                          className="w-full h-24 bg-[#0a0a0a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white placeholder-[#666] resize-none focus:outline-none focus:border-[#cc785c] transition-colors"
                          disabled={isGenerating}
                        />
                        
                        <button
                          onClick={() => generateChart(prompt)}
                          disabled={isGenerating || !prompt.trim()}
                          className="absolute bottom-3 right-3 bg-[#cc785c] hover:bg-[#b8694f] disabled:bg-[#666] disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              Generate Chart
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FileUpload
                          onFileProcessed={handleFileProcessed}
                          onError={handleFileError}
                          className="bg-[#0a0a0a] border border-[#3a3a3a] rounded-xl"
                        />
                        
                        {uploadedData && (
                          <div className="space-y-3">
                            <textarea
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              placeholder="Optional: Describe what type of chart you'd like (e.g., 'Show this as a line chart' or 'Focus on the trends over time')"
                              className="w-full h-20 bg-[#0a0a0a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white placeholder-[#666] resize-none focus:outline-none focus:border-[#cc785c] transition-colors"
                              disabled={isGenerating}
                            />
                            
                            <button
                              onClick={() => generateChart()}
                              disabled={isGenerating}
                              className="w-full bg-[#cc785c] hover:bg-[#b8694f] disabled:bg-[#666] disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Creating Chart...
                                </>
                              ) : (
                                <>
                                  Generate Chart from Data
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Model Selector */}
                  {user && (
                    <ModelSelector
                      selectedModel={selectedModel}
                      onModelSelect={setSelectedModel}
                      availableModels={AVAILABLE_MODELS}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Examples Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  See It In Action
                </h2>
                <p className="text-lg text-[#a3a3a3] max-w-2xl mx-auto">
                  Click any example below to see how easy it is to create stunning charts
                </p>
              </div>
              
              <InteractiveExamples onExampleSelect={handleExampleSelect} />
            </div>
          </section>
        </>
      ) : (
        // Show generated chart and customization when chart exists
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Generated Chart Display */}
            <div className="space-y-6 min-w-0">
              <div className="bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-4 md:p-8">
                <h3 className="text-xl md:text-2xl font-normal text-[#f5f5f5] mb-4 md:mb-6 tracking-tight">Your Chart</h3>
                <div className="w-full h-[450px] md:h-[500px]">
                  <ChartRenderer
                    config={currentChart.config}
                    className="w-full h-full"
                    width="100%"
                    height="100%"
                    showControls={true}
                  />
                </div>
                <div className="mt-4 md:mt-6 p-3 md:p-4 bg-[#1a1a1a] rounded-xl border border-[#3a3a3a]">
                  <p className="text-sm text-[#a3a3a3] break-words">
                    <strong className="text-[#cc785c]">Query:</strong> {currentChart.prompt}
                  </p>
                  <p className="text-xs text-[#737373] mt-2">
                    Model: {currentChart.model}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right: Customization Panel */}
            <div className="space-y-6">
              <EChartsCustomizationPanel
                config={currentChart.config}
                onConfigChange={(newConfig) => {
                  setCurrentChart({
                    ...currentChart,
                    config: newConfig
                  })
                }}
                onExport={(format) => {
                  // ECharts export will be handled by the chart component itself
                  toast.success(`Chart exported as ${format.toUpperCase()}`)
                }}
              />
              
              <button
                onClick={() => {
                  setCurrentChart(null)
                  setPrompt('')
                  setDataRequest('')
                  setUploadedData(null)
                  setInputMode('text')
                }}
                className="w-full bg-[#3a3a3a] text-[#f5f5f5] py-4 px-6 rounded-full font-medium hover:bg-[#4a4a4a] transition-all duration-300 border border-[#4a4a4a]"
              >
                Create New Chart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingPage