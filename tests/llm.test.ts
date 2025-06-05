import { generateText } from '../lib/llm';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ choices: [{ message: { content: 'ok' } }] })
  }) as any;
});

describe('generateText', () => {
  it('calls OpenAI when provider is openai', async () => {
    await generateText('openai', 'hi');
    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
