import React, { useState } from 'react'
import { Sparkles, Loader2, ArrowRight, Play, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { AIProviderService, AVAILABLE_MODELS } from '@/lib/aiProviders'
import { ChartConfig } from '@/types/chart'
import { EChartsCustomizationService } from '@/lib/echartsCustomization'
import ChartRenderer from './ChartRenderer'
import ModelSelector from './ModelSelector'
import EChartsCustomizationPanel from './EChartsCustomizationPanel'
import InteractiveExamples from './InteractiveExamples'
import TremorDebugChart from './TremorDebugChart'
import TremorTestComponent from './TremorTestComponent'
import ChartTestSuite from './ChartTestSuite'
import toast from 'react-hot-toast'

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
        colorPalette: 'default'
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
        colorPalette: 'default'
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
        colorPalette: 'default'
      }
    }
  }
]

interface LandingPageProps {
  onNavigate?: (page: 'landing' | 'pricing' | 'settings' | 'test-charts') => void
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

  const generateChart = async (customPrompt?: string) => {
    const currentPrompt = customPrompt || prompt
    if (!currentPrompt.trim()) {
      toast.error('Please describe what data you want to visualize')
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

        const chartResponse = await aiService.generateChart(currentPrompt, selectedModel, dataRequest)
        
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
        colorPalette: 'default'
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
        chartConfig = generateTrialChart(currentPrompt, dataRequest)
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
        colorPalette: 'default'
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
        colorPalette: 'default'
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
        colorPalette: 'default'
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
        colorPalette: 'default'
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
        colorPalette: 'default'
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
    <div className="min-h-screen bg-[#1a1a1a]">

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!currentChart ? (
          // Show Interactive Examples when no chart is generated
          <div className="mb-8">
            <InteractiveExamples onExampleSelect={handleExampleSelect} />
            {/* Chart Test Suite */}
            <div className="mt-8">
              <div className="bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Test All Chart Types</h2>
                <p className="text-[#a3a3a3] mb-4">Click below to test all chart types with colors and customization</p>
                <button
                  onClick={() => onNavigate?.('test-charts')}
                  className="bg-[#cc785c] text-white px-6 py-3 rounded-lg hover:bg-[#b8694f] transition-colors"
                >
                  Open Chart Test Suite
                </button>
              </div>
              
              {/* Basic Tremor Test */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Basic Tremor Test</h2>
                <TremorTestComponent />
              </div>
            </div>
          </div>
        ) : (
          // Show generated chart and customization when chart exists
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Generated Chart Display */}
            <div className="space-y-6">
              <div className="bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-8">
                <h3 className="text-2xl font-normal text-[#f5f5f5] mb-6 tracking-tight">Your Chart</h3>
                <ChartRenderer
                  config={currentChart.config}
                  className="w-full"
                />
                <div className="mt-6 p-4 bg-[#1a1a1a] rounded-xl border border-[#3a3a3a]">
                  <p className="text-sm text-[#a3a3a3]">
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
                }}
                className="w-full bg-[#3a3a3a] text-[#f5f5f5] py-4 px-6 rounded-full font-medium hover:bg-[#4a4a4a] transition-all duration-300 border border-[#4a4a4a]"
              >
                Create New Chart
              </button>
            </div>
          </div>
        )}

        {/* Always show the input section at bottom when no chart or simplified when chart exists */}
        <div className="max-w-2xl mx-auto">
          <div className={`${currentChart ? 'mt-16' : ''}`}>
            <h2 className="text-3xl font-normal text-[#f5f5f5] mb-8 tracking-tight text-center">
              {currentChart ? 'Create Another Chart' : 'Visualize Your Data'}
            </h2>
            
            <div className="bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xl font-normal text-[#f5f5f5] mb-4 tracking-tight">
                    What data do you want to visualize?
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Examples:\n• Monthly sales figures for 2023\n• Weather patterns in London\n• Population demographics by age\n• Stock prices over time\n• Survey results breakdown"
                    rows={user ? 4 : 5}
                    className="w-full px-4 py-4 bg-[#1a1a1a] border border-[#3a3a3a] text-[#f5f5f5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#cc785c] focus:border-transparent resize-none placeholder-[#737373] text-base leading-relaxed transition-all duration-300"
                  />
                </div>

                {/* AI Model Selection - Available for all users */}
                <div>
                  <label className="block text-xl font-normal text-[#f5f5f5] mb-4 tracking-tight">Choose AI Model</label>
                  <ModelSelector
                    selectedModel={selectedModel}
                    onModelChange={setSelectedModel}
                    userCredits={user ? (userProfile?.credits || 0) : 999} // Trial users get access to all models
                  />
                  <p className="text-sm text-[#a3a3a3] mt-4 flex items-center">
                    <span className="text-[#cc785c] mr-2">✨</span>
                    We provide all API access - no keys needed!
                    {!user && (
                      <span className="ml-2 text-[#cc785c]">(Trial mode)</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => generateChart()}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-[#cc785c] text-white py-5 px-8 rounded-full font-medium hover:bg-[#b8694f] focus:outline-none focus:ring-2 focus:ring-[#cc785c] focus:ring-offset-2 focus:ring-offset-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transition-all duration-300 text-lg shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating your visualization...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Create Visualization</span>
                    </>
                  )}
                </button>

                {!user && (
                  <div className="text-center p-5 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl">
                    <p className="text-sm text-[#cc785c] mb-2">
                      🎆 <strong>{3 - trialChartsUsed} free charts remaining</strong>
                    </p>
                    <p className="text-xs text-[#a3a3a3]">
                      Sign in with Google for unlimited charts and credit tracking
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage