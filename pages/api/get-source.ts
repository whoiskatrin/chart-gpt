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
    const prompt = `Given the following text "${inputData}", identify and extract the data source. Follow the format "Data source: {data source}". Please provide the source name and do not add any additional words, keep it short.`;

    const source = await generateText(provider, prompt);

    res.status(200).send(source);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
