const prisma = require('../config/database');
const { success, failure } = require('../utils/response');
const leadService = require('../services/leadService');
const { handleWhatsAppWebhook } = require('../integrations/whatsapp/webhookHandler');
const { parseIndiaMartCSV } = require('../integrations/indiamart/csvParser');

async function resolveOrganizationId(req) {
  const apiKey = req.headers['x-api-key'] || req.headers['X-API-KEY'];
  if (apiKey) {
    const item = await prisma.apiKey.findUnique({ where: { key: String(apiKey) } });
    if (item?.organizationId) return item.organizationId;
  }
  const org = await prisma.organization.findFirst({ orderBy: { createdAt: 'asc' } });
  return org?.id || null;
}

function guessLead(payload = {}) {
  return {
    name: payload.name || payload.full_name || payload.fullName || 'Webhook Lead',
    phone: payload.phone || payload.mobile || payload.phone_number || payload.phoneNumber || `+9198${Math.floor(Math.random() * 1e8)}`,
    email: payload.email || payload.email_address || payload.emailAddress || null,
    city: payload.city || null,
    sourceDetail: payload.sourceDetail || payload.formId || payload.campaign || null,
    projectId: payload.projectId || null
  };
}

async function meta(req, res) {
  try {
    const organizationId = await resolveOrganizationId(req);
    if (!organizationId) return res.status(400).json(failure('CONFIG_ERROR', 'No organization found to attach webhook lead'));
    const leadInput = guessLead(req.body || {});
    const lead = await leadService.createLead({
      ...leadInput,
      organizationId,
      source: 'META_ADS',
      status: 'NEW'
    });
    return res.json(success({ leadId: lead.id }, 'Meta webhook processed'));
  } catch (error) {
    return res.status(500).json(failure('SERVER_ERROR', error.message));
  }
}

async function google(req, res) {
  try {
    const organizationId = await resolveOrganizationId(req);
    if (!organizationId) return res.status(400).json(failure('CONFIG_ERROR', 'No organization found to attach webhook lead'));
    const leadInput = guessLead(req.body || {});
    const lead = await leadService.createLead({
      ...leadInput,
      organizationId,
      source: 'GOOGLE_ADS',
      status: 'NEW'
    });
    return res.json(success({ leadId: lead.id }, 'Google webhook processed'));
  } catch (error) {
    return res.status(500).json(failure('SERVER_ERROR', error.message));
  }
}

async function whatsapp(req, res) {
  try {
    const organizationId = await resolveOrganizationId(req);
    if (!organizationId) return res.status(400).json(failure('CONFIG_ERROR', 'No organization found to attach webhook lead'));

    const parsed = handleWhatsAppWebhook(req.body || {});
    const leadInput = guessLead(parsed?.body || req.body || {});
    const lead = await leadService.createLead({
      ...leadInput,
      organizationId,
      source: 'WHATSAPP_INBOUND',
      status: 'NEW'
    });

    // store inbound communication for traceability
    await prisma.communication.create({
      data: {
        leadId: lead.id,
        channel: 'WHATSAPP',
        direction: 'INBOUND',
        content: JSON.stringify(req.body || {}),
        status: 'DELIVERED',
        deliveredAt: new Date(),
        metadata: { webhook: 'whatsapp' }
      }
    });

    return res.json(success({ leadId: lead.id, received: true }, 'WhatsApp webhook processed'));
  } catch (error) {
    return res.status(500).json(failure('SERVER_ERROR', error.message));
  }
}

async function indiamart(req, res) {
  try {
    const organizationId = await resolveOrganizationId(req);
    if (!organizationId) return res.status(400).json(failure('CONFIG_ERROR', 'No organization found to attach webhook lead'));

    const csv = req.body?.csv;
    if (!csv) {
      // Demo payload: create one lead
      const leadInput = guessLead(req.body || {});
      const lead = await leadService.createLead({
        ...leadInput,
        organizationId,
        source: 'INDIAMART',
        status: 'NEW'
      });
      return res.json(success({ imported: 1, leadId: lead.id }, 'IndiaMART webhook processed'));
    }

    const parsed = parseIndiaMartCSV(String(csv));
    const rows = parsed?.data || [];
    let imported = 0;
    for (const row of rows.slice(0, 200)) {
      const leadInput = guessLead(row);
      await leadService.createLead({
        ...leadInput,
        organizationId,
        source: 'INDIAMART',
        status: 'NEW'
      });
      imported += 1;
    }
    return res.json(success({ imported }, 'IndiaMART CSV imported'));
  } catch (error) {
    return res.status(500).json(failure('SERVER_ERROR', error.message));
  }
}

module.exports = { meta, google, whatsapp, indiamart };
