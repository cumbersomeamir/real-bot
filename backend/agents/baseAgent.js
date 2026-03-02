const { logAgentEvent } = require('./agentLogger');

class BaseAgent {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.isActive = true;
  }

  async execute(input) {
    const startTime = Date.now();
    try {
      const result = await this.run(input);
      await this.log({
        agentType: this.name,
        action: 'execute',
        input,
        output: result,
        latencyMs: Date.now() - startTime,
        success: true
      });
      return result;
    } catch (error) {
      await this.log({
        agentType: this.name,
        action: 'execute',
        input,
        error: error.message,
        latencyMs: Date.now() - startTime,
        success: false
      });
      throw error;
    }
  }

  async run() {
    throw new Error('Must implement run()');
  }

  async log(data) {
    await logAgentEvent(data);
  }
}

module.exports = BaseAgent;
