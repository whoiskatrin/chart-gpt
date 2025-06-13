import { HfInference } from '@huggingface/inference'

export interface HuggingFaceModel {
  id: string
  name: string
  description: string
  category: 'text-generation' | 'code-generation' | 'conversational'
}

export const SUPPORTED_MODELS: HuggingFaceModel[] = [
  {
    id: 'microsoft/DialoGPT-large',
    name: 'DialoGPT Large',
    description: 'Large-scale conversational model for chart generation',
    category: 'conversational'
  },
  {
    id: 'bigcode/starcoder',
    name: 'StarCoder',
    description: 'Code generation model optimized for JavaScript/TypeScript',
    category: 'code-generation'
  },
  {
    id: 'microsoft/CodeBERT-base',
    name: 'CodeBERT',
    description: 'Code understanding model for chart logic',
    category: 'code-generation'
  },
  {
    id: 'google/flan-t5-large',
    name: 'FLAN-T5 Large',
    description: 'Instruction-tuned model for chart specifications',
    category: 'text-generation'
  },
  {
    id: 'facebook/blenderbot-3B',
    name: 'BlenderBot 3B',
    description: 'Conversational AI for interactive chart creation',
    category: 'conversational'
  }
]

export class HuggingFaceService {
  private hf: HfInference
  
  constructor(apiKey: string) {
    this.hf = new HfInference(apiKey)
  }

  async generateChartLogic(
    prompt: string, 
    modelId: string = 'microsoft/DialoGPT-large',
    options: {
      maxTokens?: number
      temperature?: number
      topP?: number
    } = {}
  ): Promise<string> {
    const { maxTokens = 500, temperature = 0.7, topP = 0.9 } = options

    try {
      const response = await this.hf.textGeneration({
        model: modelId,
        inputs: this.createChartPrompt(prompt),
        parameters: {
          max_new_tokens: maxTokens,
          temperature,
          top_p: topP,
          return_full_text: false,
        },
      })

      return this.parseChartResponse(response.generated_text)
    } catch (error) {
      console.error('HuggingFace API error:', error)
      throw new Error('Failed to generate chart logic')
    }
  }

  private createChartPrompt(userInput: string): string {
    return `Generate a chart configuration in JSON format based on this request:
"${userInput}"

Respond with a JSON object containing:
- type: chart type (bar, line, pie, scatter, area, etc.)
- data: sample data structure
- options: chart configuration options
- customization: styling and appearance settings

Example format:
{
  "type": "bar",
  "data": {
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [{
      "label": "Sales",
      "data": [10, 20, 30],
      "backgroundColor": "#3b82f6"
    }]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "title": {
        "display": true,
        "text": "Monthly Sales"
      }
    }
  }
}

Chart configuration:`
  }

  private parseChartResponse(response: string): string {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        JSON.parse(jsonMatch[0])
        return jsonMatch[0]
      }
    } catch (error) {
      console.warn('Failed to parse JSON response, returning raw text')
    }
    
    return response
  }

  async validateModel(modelId: string): Promise<boolean> {
    try {
      await this.hf.textGeneration({
        model: modelId,
        inputs: 'Test',
        parameters: { max_new_tokens: 1 }
      })
      return true
    } catch (error) {
      return false
    }
  }
}