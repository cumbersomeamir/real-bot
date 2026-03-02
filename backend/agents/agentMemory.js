class AgentMemory {
  constructor() {
    this.memory = new Map();
  }

  push(key, value) {
    const list = this.memory.get(key) || [];
    list.push({ at: new Date().toISOString(), value });
    this.memory.set(key, list.slice(-20));
  }

  get(key) {
    return this.memory.get(key) || [];
  }
}

module.exports = new AgentMemory();
