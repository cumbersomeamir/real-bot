const communicationService = require('../services/communicationService');
const { success, failure } = require('../utils/response');

async function templates(req, res) {
  try {
    const items = await communicationService.listTemplates();
    return res.json(success({ items }));
  } catch (error) {
    return res.status(500).json(failure('SERVER_ERROR', error.message));
  }
}

async function createTemplate(req, res) {
  try {
    if (!req.body?.name || !req.body?.content) {
      return res.status(400).json(failure('VALIDATION_ERROR', 'name and content are required'));
    }

    const item = await communicationService.createTemplate(req.body);
    return res.status(201).json(success(item, 'Template created'));
  } catch (error) {
    return res.status(400).json(failure('VALIDATION_ERROR', error.message));
  }
}

async function queue(req, res) {
  try {
    const report = await communicationService.queueReport(req.user.organizationId);
    return res.json(success(report));
  } catch (error) {
    return res.status(500).json(failure('SERVER_ERROR', error.message));
  }
}

async function deliveryReport(req, res) {
  try {
    const report = await communicationService.queueReport(req.user.organizationId);
    return res.json(success(report));
  } catch (error) {
    return res.status(500).json(failure('SERVER_ERROR', error.message));
  }
}

async function send(req, res) {
  try {
    const { leadId, channel, content, templateId, variables, metadata } = req.body || {};
    if (!leadId || !channel) {
      return res.status(400).json(failure('VALIDATION_ERROR', 'leadId and channel are required'));
    }

    const comm = await communicationService.queueMessage({
      organizationId: req.user.organizationId,
      leadId,
      channel,
      content,
      templateId,
      variables,
      metadata
    });

    return res.status(201).json(success(comm, 'Message queued'));
  } catch (error) {
    return res.status(500).json(failure('SERVER_ERROR', error.message));
  }
}

module.exports = {
  templates,
  createTemplate,
  queue,
  deliveryReport,
  send
};
