const prisma = require('../config/database');

async function logAgentEvent(payload) {
  try {
    await prisma.agentLog.create({ data: payload });
  } catch (error) {
    // prevent logging failures from blocking agent flow
  }
}

module.exports = { logAgentEvent };
