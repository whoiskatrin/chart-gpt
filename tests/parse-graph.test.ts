jest.mock('@contextco/context-node', () => ({
  ContextAPI: jest.fn().mockImplementation(() => ({
    log: { conversation: jest.fn() }
  })),
  ContextAPIOptionalParams: {},
  KnownMessageRole: { User: 'user', Assistant: 'assistant' },
  Credential: jest.fn()
}));

import handler from '../pages/api/parse-graph';
import { createMocks } from 'node-mocks-http';
import * as helper from '../utils/helper';
import * as llm from '../lib/llm';

describe('parse-graph API', () => {
  it('returns 200 when generation succeeds', async () => {
    jest.spyOn(helper, 'getUserCredits').mockResolvedValue(10);
    jest.spyOn(helper, 'decreaseUserCredits').mockResolvedValue();
    jest.spyOn(llm, 'generateText').mockResolvedValue('data');

    const { req, res } = createMocks({ method: 'POST', body: { prompt: 'hi', provider: 'openai' } });
    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
  });
});
