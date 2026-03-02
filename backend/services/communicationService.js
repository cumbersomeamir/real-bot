const prisma = require('../config/database');
const communicationQueue = require('../queues/communicationQueue');
const { useBullMQ } = require('../queues/mode');
const { deliverCommunication } = require('./deliveryService');

function renderTemplate(content = '', vars = {}) {
  return String(content).replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const v = vars?.[key];
    return v === undefined || v === null ? '' : String(v);
  });
}

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

async function queueReport(organizationId) {
  const [queued, sent, delivered, failed, read, bullCounts] = await Promise.all([
    prisma.communication.count({ where: { lead: { organizationId }, status: 'QUEUED' } }),
    prisma.communication.count({ where: { lead: { organizationId }, status: 'SENT' } }),
    prisma.communication.count({ where: { lead: { organizationId }, status: 'DELIVERED' } }),
    prisma.communication.count({ where: { lead: { organizationId }, status: 'FAILED' } }),
    prisma.communication.count({ where: { lead: { organizationId }, status: 'READ' } }),
    communicationQueue.getJobCounts('waiting', 'active', 'delayed', 'failed', 'completed')
  ]);

  return {
    queued,
    sent,
    delivered,
    failed,
    read,
    bullmq: bullCounts
  };
}

async function queueMessage({
  organizationId,
  leadId,
  channel,
  direction = 'OUTBOUND',
  content,
  templateId,
  variables,
  metadata,
  agentId
}) {
  if (!leadId) throw new Error('leadId is required');
  if (!channel) throw new Error('channel is required');

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead || lead.organizationId !== organizationId) throw new Error('Lead not found');

  let finalContent = content;
  let resolvedTemplateId = templateId || null;
  if (!finalContent && resolvedTemplateId) {
    const tpl = await prisma.whatsAppTemplate.findUnique({ where: { id: resolvedTemplateId } });
    if (!tpl) throw new Error('Template not found');
    finalContent = tpl.content;
  }
  if (!finalContent) throw new Error('content is required (or provide templateId)');

  const rendered = renderTemplate(finalContent, {
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    ...(variables || {})
  });

  const comm = await prisma.communication.create({
    data: {
      leadId,
      channel,
      direction,
      templateId: resolvedTemplateId,
      content: rendered,
      status: 'QUEUED',
      metadata: metadata || {},
      isAIGenerated: Boolean(agentId),
      agentId: agentId || null
    }
  });

  if (useBullMQ()) {
    await communicationQueue.add(
      'deliver',
      { communicationId: comm.id },
      { removeOnComplete: true, removeOnFail: false }
    );
  } else {
    // Polling mode: deliver immediately (no Redis/BullMQ required)
    await deliverCommunication(comm.id);
  }

  // track on lead for leakage KPI
  await prisma.lead.update({
    where: { id: leadId },
    data: { lastContactAt: new Date() }
  });

  return comm;
}

module.exports = { listTemplates, createTemplate, queueReport, queueMessage };
