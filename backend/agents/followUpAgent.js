const BaseAgent = require('./baseAgent');

class FollowUpAgent extends BaseAgent {
  constructor(config = {}) {
    super('followup', config);
  }

  async run(input) {
    return {
      leadId: input.leadId,
      scheduledDays: [0, 2, 5, 10, 15, 30],
      channels: ['WHATSAPP', 'SMS', 'EMAIL'],
      status: 'scheduled'
    };
  }
}

module.exports = FollowUpAgent;
