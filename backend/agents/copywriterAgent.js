const BaseAgent = require('./baseAgent');

class CopywriterAgent extends BaseAgent {
  constructor(config = {}) {
    super('copywriter', config);
  }

  async run(input) {
    return {
      channel: input.channel || 'WHATSAPP',
      body: `Hi ${input.name || 'there'}, sharing project details and next steps for your property interest.`
    };
  }
}

module.exports = CopywriterAgent;
