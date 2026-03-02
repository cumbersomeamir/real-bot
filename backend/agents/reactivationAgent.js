const BaseAgent = require('./baseAgent');

class ReactivationAgent extends BaseAgent {
  constructor(config = {}) {
    super('reactivation', config);
  }

  async run(input) {
    return {
      batchId: input.batchId,
      matchedLeads: 0,
      status: 'processing'
    };
  }
}

module.exports = ReactivationAgent;
