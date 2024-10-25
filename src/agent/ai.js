import { AI } from 'llmclient';
import dotenv from 'dotenv';
dotenv.config()

const ai = AI('openai', { 
  model: 'gpt-4o-mini',
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY
});

ai.setOptions({ debug: true });

export { ai };