async function runLLM(prompt, model = process.env.OPENAI_MODEL || 'gpt-4o-mini') {
  return {
    model,
    output: `Stubbed response for prompt length ${prompt?.length || 0}`
  };
}

module.exports = { runLLM };
