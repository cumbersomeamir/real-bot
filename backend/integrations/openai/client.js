const OpenAI = require('openai');
const env = require('../../config/env');

function hasOpenAIConfig() {
  return Boolean(env.OPENAI_API_KEY);
}

async function runLLM(prompt, model = env.OPENAI_MODEL || 'gpt-4o-mini') {
  if (!prompt) throw new Error('prompt is required');

  if (!hasOpenAIConfig()) {
    // Demo-first fallback: deterministic output so the feature remains usable without keys.
    return {
      model: 'mock',
      output: `Demo AI (no OPENAI_API_KEY): ${String(prompt).slice(0, 220)}`
    };
  }

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const resp = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'You are a helpful sales ops assistant for a real-estate CRM.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.4
  });

  const output = resp?.choices?.[0]?.message?.content || '';
  return { model, output };
}

module.exports = { runLLM, hasOpenAIConfig };
