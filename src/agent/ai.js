import { AI } from 'llmclient';

const ai = AI('openai', { 
  model: 'gpt-4-turbo',
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY
});

ai.setOptions({ debug: true });

export { ai };