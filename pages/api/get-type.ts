import { NextApiRequest, NextApiResponse } from 'next';
import { generateText, ModelProvider } from '../../lib/llm';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { inputData, provider = 'bard' } = req.body as {
      inputData: string;
      provider?: ModelProvider;
    };
    const prompt = `The following are the possible chart types supported by the code provided: area, bar, line, composed, scatter, pie, radar, radialBar, treemap, and funnel. Given the user input: ${inputData}, identify the chart type the user wants to display. Return just one word`;

    const chartType = await generateText(provider, prompt);

    if (
      !chartType ||
      chartType.includes('AI-model') ||
      chartType.includes('programmed') ||
      chartType.includes('model') ||
      chartType.includes('AI')
    ) {
      throw new Error('Failed to generate output data');
    }

    res.status(200).json(chartType);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
