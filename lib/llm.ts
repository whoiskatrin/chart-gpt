export type ModelProvider = 'bard' | 'openai' | 'claude';

export async function generateText(provider: ModelProvider, prompt: string): Promise<string> {
  switch (provider) {
    case 'openai':
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const openaiData = await openaiRes.json();
      return openaiData.choices[0].message.content.trim();
    case 'claude':
      const claudeRes = await fetch('https://api.anthropic.com/v1/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
          max_tokens: 512,
        }),
      });
      const claudeData = await claudeRes.json();
      return claudeData.completion.trim();
    case 'bard':
    default:
      const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${process.env.BARD_KEY}`;
      const bardRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: { text: prompt } }),
      });
      const bardData = await bardRes.json();
      if ('candidates' in bardData) {
        return bardData.candidates[0].output as string;
      }
      throw new Error('Invalid response from Bard');
  }
}
