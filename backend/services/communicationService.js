const prisma = require('../config/database');

async function listTemplates() {
  return prisma.whatsAppTemplate.findMany({ orderBy: { createdAt: 'desc' } });
}

async function createTemplate(data) {
  return prisma.whatsAppTemplate.create({
    data: {
      name: data.name,
      content: data.content,
      category: data.category || 'marketing',
      language: data.language || 'en',
      variables: Array.isArray(data.variables) ? data.variables : [],
      status: data.status || 'pending',
      externalId: data.externalId || null
    }
  });
}

async function queueReport() {
  return {
    queued: 128,
    sent: 112,
    delivered: 96,
    failed: 7,
    read: 68
  };
}

module.exports = { listTemplates, createTemplate, queueReport };
