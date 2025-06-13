import React, { useState } from 'react'
import { Sparkles, Database, Loader2, Download, Plus, CreditCard } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { AIProviderService, AVAILABLE_MODELS } from '@/lib/aiProviders'
import { ChartConfig } from '@/types/chart'
import { ChartCustomizationService, DEFAULT_CUSTOMIZATION } from '@/lib/chartCustomization'
import ChartRenderer from './ChartRenderer'
import ModelSelector from './ModelSelector'
import CustomizationPanel from './CustomizationPanel'
import toast from 'react-hot-toast'

export const Dashboard: React.FC = () => {
  const { userProfile, updateCredits } = useAuthStore()
  const [prompt, setPrompt] = useState('')
  const [dataRequest, setDataRequest] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo')
  const [currentChart, setCurrentChart] = useState<{ config: ChartConfig; prompt: string; model: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    google: ''
  })

  const generateChart = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your chart')
      return
    }

    const selectedModelData = AVAILABLE_MODELS.find(m => m.id === selectedModel)
    if (!selectedModelData) {
      toast.error('Please select a valid model')
      return
    }

    if (!userProfile || userProfile.credits < selectedModelData.creditsPerRequest) {
      toast.error('Insufficient credits. Please purchase more credits to continue.')
      return
    }

    // Check if required API key is available
    const requiredKey = getRequiredApiKey(selectedModelData.provider)
    if (!requiredKey) {
      toast.error(`Please add your ${selectedModelData.provider.toUpperCase()} API key in settings`)
      return
    }

    setIsGenerating(true)

    try {
      const aiService = new AIProviderService({
        openaiApiKey: apiKeys.openai,
        anthropicApiKey: apiKeys.anthropic,
        googleApiKey: apiKeys.google
      })

      const chartResponse = await aiService.generateChart(prompt, selectedModel, dataRequest)
      
      let chartConfig: ChartConfig
      try {
        const parsedConfig = JSON.parse(chartResponse)
        chartConfig = {
          type: parsedConfig.type || 'bar',
          data: parsedConfig.data || createFallbackData(),
          options: parsedConfig.options || createFallbackOptions(parsedConfig.title),
          customization: DEFAULT_CUSTOMIZATION
        }
      } catch (parseError) {
        console.warn('Failed to parse AI response, creating fallback chart')
        chartConfig = createFallbackChart(prompt)
      }

      setCurrentChart({
        config: chartConfig,
        prompt,
        model: selectedModelData.name
      })

      // Deduct credits
      await updateCredits(-selectedModelData.creditsPerRequest)
      
      toast.success(`Chart generated! ${selectedModelData.creditsPerRequest} credits used.`)
    } catch (error) {
      console.error('Chart generation failed:', error)
      toast.error('Failed to generate chart. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const getRequiredApiKey = (provider: string): string | null => {
    switch (provider) {
      case 'openai':
        return apiKeys.openai || null
      case 'anthropic':
        return apiKeys.anthropic || null
      case 'google':
        return apiKeys.google || null
      default:
        return null
    }
  }

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
      title: {
        display: true,
        text: title || 'Generated Chart'
      },
      legend: {
        position: 'top' as const
      }
    }
  })

  const createFallbackChart = (prompt: string): ChartConfig => {
    const words = prompt.toLowerCase()
    let chartType: ChartConfig['type'] = 'bar'
    
    if (words.includes('line') || words.includes('trend') || words.includes('time')) {
      chartType = 'line'
    } else if (words.includes('pie') || words.includes('portion') || words.includes('percentage')) {
      chartType = 'pie'
    } else if (words.includes('scatter') || words.includes('correlation')) {
      chartType = 'scatter'
    }

    return {
      type: chartType,
      data: createFallbackData(),
      options: createFallbackOptions('Chart from: ' + prompt.slice(0, 50) + '...'),
      customization: DEFAULT_CUSTOMIZATION
    }
  }

  const handleConfigChange = (newConfig: ChartConfig) => {
    if (currentChart) {
      setCurrentChart({
        ...currentChart,
        config: newConfig
      })
    }
  }

  return (
    <div className="min-h-screen bg-vercel-lightest-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            {/* API Keys Configuration */}
            <div className="bg-white rounded-lg shadow-vercel border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-vercel-black mb-4">API Keys</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-vercel-black mb-2">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeys.openai}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-vercel-black mb-2">
                    Anthropic API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeys.anthropic}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, anthropic: e.target.value }))}
                    placeholder="sk-ant-..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-vercel-black mb-2">
                    Google API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeys.google}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, google: e.target.value }))}
                    placeholder="AIza..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Chart Generation */}
            <div className="bg-white rounded-lg shadow-vercel border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-vercel-black mb-4">Generate Chart</h2>
              
              <div className="space-y-4">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  userCredits={userProfile?.credits || 0}
                />

                <div>
                  <label className="block text-sm font-medium text-vercel-black mb-2">
                    Data Request (Optional)
                  </label>
                  <input
                    value={dataRequest}
                    onChange={(e) => setDataRequest(e.target.value)}
                    placeholder="e.g., Monthly sales data for 2023"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-xs text-vercel-gray mt-1">
                    Specify what data you want the AI to generate
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-vercel-black mb-2">
                    Chart Description
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the chart you want to create..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  onClick={generateChart}
                  disabled={isGenerating || !prompt.trim() || (userProfile?.credits || 0) < (AVAILABLE_MODELS.find(m => m.id === selectedModel)?.creditsPerRequest || 1)}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Chart</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Credits Display */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-orange-900">Available Credits</h3>
                  <p className="text-2xl font-bold text-orange-600">{userProfile?.credits || 0}</p>
                </div>
                <CreditCard className="h-8 w-8 text-orange-500" />
              </div>
              <button className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                Buy More Credits
              </button>
            </div>
          </div>

          {/* Right Panel - Chart Display */}
          <div className="lg:col-span-2">
            {currentChart ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-vercel border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-vercel-black">Generated Chart</h3>
                      <p className="text-sm text-vercel-gray">
                        Model: {currentChart.model}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowCustomization(!showCustomization)}
                        className="px-4 py-2 bg-gray-100 text-vercel-black rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Customize
                      </button>
                    </div>
                  </div>

                  <ChartRenderer
                    config={currentChart.config}
                    className="w-full"
                  />

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-vercel-black mb-2">Original Prompt</h4>
                    <p className="text-sm text-vercel-gray">{currentChart.prompt}</p>
                  </div>
                </div>

                {showCustomization && (
                  <div className="bg-white rounded-lg shadow-vercel border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-vercel-black mb-4">Customization</h3>
                    <CustomizationPanel
                      config={currentChart.config}
                      onConfigChange={handleConfigChange}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-vercel border border-gray-200 p-12 text-center">
                <div className="text-orange-400 mb-4">
                  <Sparkles className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-vercel-black mb-2">Ready to Create Charts</h3>
                <p className="text-vercel-gray">
                  Add your API keys and describe the chart you want to create to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard