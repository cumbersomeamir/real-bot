const BaseAgent = require('./baseAgent');

class VoiceAgent extends BaseAgent {
  constructor(config = {}) {
    super('voice', config);
  }

  async run(input) {
    return {
      leadId: input.leadId,
      callQueued: true,
      script: 'default-high-intent'
    };
  }
}

module.exports = VoiceAgent;
