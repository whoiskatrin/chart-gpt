import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

export interface AIModel {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'google'
  description: string
  creditsPerRequest: number
  maxTokens: number
}

export const AVAILABLE_MODELS: AIModel[] = [
  // OpenAI Models
  {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'Most capable model, best for complex chart logic',
    creditsPerRequest: 3,
    maxTokens: 4096
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    description: 'High quality responses, reliable chart generation',
    creditsPerRequest: 2,
    maxTokens: 4096
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: 'Fast and efficient for simple charts',
    creditsPerRequest: 1,
    maxTokens: 4096
  },
  
  // Anthropic Models
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    description: 'Most intelligent model for complex data analysis',
    creditsPerRequest: 3,
    maxTokens: 4096
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    description: 'Balanced performance and speed',
    creditsPerRequest: 2,
    maxTokens: 4096
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    description: 'Fastest model for quick chart generation',
    creditsPerRequest: 1,
    maxTokens: 4096
  },
  
  // Google Models
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    description: 'Advanced reasoning for data visualization',
    creditsPerRequest: 2,
    maxTokens: 2048
  },
  {
    id: 'gemini-pro-vision',
    name: 'Gemini Pro Vision',
    provider: 'google',
    description: 'Multimodal capabilities for enhanced charts',
    creditsPerRequest: 3,
    maxTokens: 2048
  }
]

interface AIProviderConfig {
  openaiApiKey?: string
  anthropicApiKey?: string
  googleApiKey?: string
}

export class AIProviderService {
  private openai?: OpenAI
  private anthropic?: Anthropic
  private google?: GoogleGenerativeAI

  constructor(config: AIProviderConfig) {
    if (config.openaiApiKey) {
      this.openai = new OpenAI({ apiKey: config.openaiApiKey, dangerouslyAllowBrowser: true })
    }
    if (config.anthropicApiKey) {
      this.anthropic = new Anthropic({ apiKey: config.anthropicApiKey, dangerouslyAllowBrowser: true })
    }
    if (config.googleApiKey) {
      this.google = new GoogleGenerativeAI(config.googleApiKey)
    }
  }

  async generateChart(
    prompt: string,
    modelId: string,
    dataRequest?: string
  ): Promise<string> {
    const model = AVAILABLE_MODELS.find(m => m.id === modelId)
    if (!model) {
      throw new Error('Model not found')
    }

    const systemPrompt = this.createSystemPrompt(dataRequest)
    const userPrompt = this.createUserPrompt(prompt, dataRequest)

    try {
      switch (model.provider) {
        case 'openai':
          return await this.generateWithOpenAI(modelId, systemPrompt, userPrompt)
        case 'anthropic':
          return await this.generateWithAnthropic(modelId, systemPrompt, userPrompt)
        case 'google':
          return await this.generateWithGoogle(modelId, systemPrompt + '\n\n' + userPrompt)
        default:
          throw new Error('Unsupported provider')
      }
    } catch (error) {
      console.error('AI generation failed:', error)
      throw new Error('Failed to generate chart configuration')
    }
  }

  private async generateWithOpenAI(modelId: string, systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI not configured')
    }

    const response = await this.openai.chat.completions.create({
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1500,
      temperature: 0.7
    })

    return response.choices[0]?.message?.content || ''
  }

  private async generateWithAnthropic(modelId: string, systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.anthropic) {
      throw new Error('Anthropic not configured')
    }

    const response = await this.anthropic.messages.create({
      model: modelId,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    })

    const content = response.content[0]
    return content.type === 'text' ? content.text : ''
  }

  private async generateWithGoogle(modelId: string, prompt: string): Promise<string> {
    if (!this.google) {
      throw new Error('Google not configured')
    }

    const model = this.google.getGenerativeModel({ model: modelId })
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  }

  private createSystemPrompt(dataRequest?: string): string {
    return `You are an expert data visualization assistant. Your task is to generate chart configurations in JSON format based on user requests.

${dataRequest ? `The user has requested specific data: "${dataRequest}". Generate realistic sample data that matches this request. For weather data, use realistic temperature ranges, precipitation amounts, and seasonal patterns. For financial data, use realistic market values and trends. For demographic data, use realistic population distributions.` : ''}

Always respond with a valid JSON object containing:
- type: chart type (bar, line, pie, doughnut, scatter, area, radar, bubble, heatmap, etc.)
- data: realistic data structure with labels and datasets
- options: comprehensive chart configuration
- title: descriptive title for the chart
- description: brief description of what the chart shows

Make the data meaningful and realistic based on the real-world context. Include proper styling, colors, and formatting options.

Example format:
{
  "type": "bar",
  "title": "Monthly Sales Performance",
  "description": "Sales data comparing different products across months",
  "data": {
    "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
    "datasets": [{
      "label": "Product A",
      "data": [65, 59, 80, 81, 56],
      "backgroundColor": "#ff6b35"
    }]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "title": {
        "display": true,
        "text": "Monthly Sales Performance"
      },
      "legend": {
        "position": "top"
      }
    },
    "scales": {
      "y": {
        "beginAtZero": true
      }
    }
  }
}`
  }

  private createUserPrompt(prompt: string, dataRequest?: string): string {
    let userPrompt = `Create a chart based on this request: "${prompt}"`
    
    if (dataRequest) {
      userPrompt += `\n\nSpecific data requested: "${dataRequest}"`
      
      // Enhanced data generation based on query type
      if (dataRequest.toLowerCase().includes('weather') || dataRequest.toLowerCase().includes('rain') || dataRequest.toLowerCase().includes('temperature')) {
        userPrompt += `\nGenerate realistic weather data with seasonal patterns, proper temperature ranges for the location, and realistic precipitation amounts. Use monthly or daily intervals as appropriate.`
      } else if (dataRequest.toLowerCase().includes('stock') || dataRequest.toLowerCase().includes('price') || dataRequest.toLowerCase().includes('financial')) {
        userPrompt += `\nGenerate realistic financial data with market-like volatility, proper scaling, and realistic price movements over time.`
      } else if (dataRequest.toLowerCase().includes('sales') || dataRequest.toLowerCase().includes('revenue') || dataRequest.toLowerCase().includes('business')) {
        userPrompt += `\nGenerate realistic business data with growth patterns, seasonal variations, and meaningful business metrics.`
      } else {
        userPrompt += `\nGenerate realistic sample data that accurately represents real-world patterns for this type of data.`
      }
    }
    
    userPrompt += `\n\nRespond only with the JSON configuration, no additional text.`
    
    return userPrompt
  }

  getModel(modelId: string): AIModel | undefined {
    return AVAILABLE_MODELS.find(m => m.id === modelId)
  }

  getModelsByProvider(provider: 'openai' | 'anthropic' | 'google'): AIModel[] {
    return AVAILABLE_MODELS.filter(m => m.provider === provider)
  }
}