import React, { useState } from 'react'
import { ChevronDown, Check, Zap, Brain, Sparkles, CreditCard } from 'lucide-react'
import { AVAILABLE_MODELS, AIModel } from '@/lib/aiProviders'

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
  userCredits: number
}

const getProviderIcon = (provider: string) => {
  switch (provider) {
    case 'openai':
      return <Sparkles className="w-4 h-4 text-green-500" />
    case 'anthropic':
      return <Brain className="w-4 h-4 text-purple-500" />
    case 'google':
      return <Zap className="w-4 h-4 text-blue-500" />
    default:
      return <Sparkles className="w-4 h-4 text-gray-500" />
  }
}

const getProviderColor = (provider: string) => {
  switch (provider) {
    case 'openai':
      return 'bg-green-900/20 text-green-300 border-green-700'
    case 'anthropic':
      return 'bg-purple-900/20 text-purple-300 border-purple-700'
    case 'google':
      return 'bg-blue-900/20 text-blue-300 border-blue-700'
    default:
      return 'bg-gray-800 text-gray-300 border-gray-600'
  }
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  userCredits
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedModelData = AVAILABLE_MODELS.find(m => m.id === selectedModel)
  const groupedModels = AVAILABLE_MODELS.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = []
    }
    acc[model.provider].push(model)
    return acc
  }, {} as Record<string, AIModel[]>)

  const canAffordModel = (model: AIModel) => userCredits >= model.creditsPerRequest

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {selectedModelData && getProviderIcon(selectedModelData.provider)}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white truncate">
              {selectedModelData?.name || 'Select a model'}
            </div>
            <div className="text-sm text-gray-400 truncate">
              {selectedModelData?.description}
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center space-x-1 bg-orange-500/20 px-2 py-1 rounded-full">
              <CreditCard className="w-3 h-3 text-orange-400" />
              <span className="text-xs font-medium text-orange-300">
                {selectedModelData?.creditsPerRequest || 0}
              </span>
            </div>
          </div>
        </div>
        
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {Object.entries(groupedModels).map(([provider, models]) => (
            <div key={provider} className="border-b border-gray-700 last:border-b-0">
              <div className="px-4 py-2 bg-gray-700 text-xs font-medium text-gray-300 uppercase tracking-wide">
                {provider === 'openai' ? 'OpenAI' : provider === 'anthropic' ? 'Anthropic' : 'Google'}
              </div>
              {models.map((model) => {
                const affordable = canAffordModel(model)
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      if (affordable) {
                        onModelChange(model.id)
                        setIsOpen(false)
                      }
                    }}
                    disabled={!affordable}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-700 focus:outline-none focus:bg-gray-700 border-b border-gray-700 last:border-b-0 transition-colors ${
                      selectedModel === model.id ? 'bg-orange-900/20 border-orange-500/30' : ''
                    } ${!affordable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {getProviderIcon(model.provider)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-white truncate">
                              {model.name}
                            </span>
                            {selectedModel === model.id && (
                              <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="text-sm text-gray-400 mt-1 truncate">
                            {model.description}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full border ${getProviderColor(model.provider)}`}>
                              {model.provider}
                            </span>
                            {!affordable && (
                              <span className="px-2 py-1 text-xs rounded-full bg-red-900/20 text-red-300 border border-red-700">
                                Insufficient credits
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className="flex items-center space-x-1 bg-orange-500/20 px-2 py-1 rounded-full">
                          <CreditCard className="w-3 h-3 text-orange-400" />
                          <span className="text-xs font-medium text-orange-300">
                            {model.creditsPerRequest}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Credits warning */}
      {userCredits < 3 && (
        <div className="mt-2 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-300">
              Low credits! Some models may not be available.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModelSelector