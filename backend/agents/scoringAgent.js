const BaseAgent = require('./baseAgent');
const { scoreLead } = require('../services/scoringService');

class ScoringAgent extends BaseAgent {
  constructor(config = {}) {
    super('scoring', config);
  }

  async run(input) {
    return scoreLead(input.lead || {});
  }
}

module.exports = ScoringAgent;
