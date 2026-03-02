const prisma = require('../config/database');
const { success, failure } = require('../utils/response');
const { runLLM } = require('../integrations/openai/client');

const FEATURE_TITLES = {
  'ai-chat-assistant': 'AI Chat Assistant',
  'webhook-builder': 'Webhook Builder',
  'report-builder': 'Custom Report Builder',
  multilanguage: 'Multi-Language Support',
  'mobile-shell': 'Mobile App Shell',
  'channel-partner-portal': 'Channel Partner Portal',
  'client-portal': 'Client-Facing Portal',
  'ai-price-optimization': 'AI Price Optimization',
  'demand-heatmap': 'Predictive Demand Heatmap',
  'ad-optimizer': 'Dynamic Ad Campaign Optimizer',
  'sell-through-predictor': 'Inventory Sell-Through Predictor',
  'document-generation': 'Document Generation',
  'payment-tracking': 'Payment Tracking',
  'chatbot-builder': 'WhatsApp Chatbot Builder',
  'api-marketplace': 'API Marketplace'
};

async function ensureFeature(feature) {
  const key = String(feature);
  const name = FEATURE_TITLES[key] || key;
  const existing = await prisma.futureFeature.findUnique({ where: { key } });
  if (existing) return existing;
  return prisma.futureFeature.create({ data: { key, name, status: 'implemented', description: 'Enabled for demo' } });
}

async function getFeature(req, res) {
  try {
    const feature = req.params.feature;
    const item = await ensureFeature(feature);
    return res.json(success(item));
  } catch (error) {
    return res.status(500).json(failure('SERVER_ERROR', error.message));
  }
}

async function postFeature(req, res) {
  const feature = req.params.feature;
  try {
    await ensureFeature(feature);

    if (feature === 'ai-chat-assistant') {
      const message = req.body?.message || req.body?.prompt;
      if (!message) return res.status(400).json(failure('VALIDATION_ERROR', 'message is required'));

      const [overview, topLeads, projects] = await Promise.all([
        prisma.lead.count({ where: { organizationId: req.user.organizationId } }),
        prisma.lead.findMany({
          where: { organizationId: req.user.organizationId, OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] },
          take: 5,
          orderBy: { score: 'desc' },
          select: { id: true, name: true, status: true, score: true, phone: true }
        }),
        prisma.project.findMany({ where: { organizationId: req.user.organizationId }, take: 5, select: { id: true, name: true, city: true, type: true } })
      ]);

      const context = {
        totalLeads: overview,
        topLeads,
        projects
      };

      const prompt = [
        'You are DealFlow AI Chat Assistant.',
        'Use the provided JSON context. Be concise, actionable, and suggest next steps.',
        '',
        `Context: ${JSON.stringify(context)}`,
        '',
        `User: ${message}`
      ].join('\n');

      const llm = await runLLM(prompt);
      return res.json(success({ reply: llm.output, context }, 'AI reply'));
    }

    if (feature === 'webhook-builder') {
      const org = await prisma.organization.findUnique({ where: { id: req.user.organizationId } });
      const settings = org?.settings || {};
      const webhooks = Array.isArray(settings.webhooks) ? settings.webhooks : [];

      const action = req.body?.action || 'list';
      if (action === 'create') {
        const name = req.body?.name || `Webhook ${webhooks.length + 1}`;
        const path = req.body?.path || `/webhooks/custom/${Date.now()}`;
        const secret = req.body?.secret || `whsec_${Math.random().toString(36).slice(2)}`;
        const item = { id: `wh_${Date.now()}`, name, path, secret, createdAt: new Date().toISOString(), active: true };
        const next = { ...settings, webhooks: [item, ...webhooks] };
        await prisma.organization.update({ where: { id: req.user.organizationId }, data: { settings: next } });
        return res.status(201).json(success(item, 'Webhook created'));
      }

      return res.json(success({ items: webhooks }, 'Webhooks'));
    }

    if (feature === 'report-builder') {
      const org = await prisma.organization.findUnique({ where: { id: req.user.organizationId } });
      const settings = org?.settings || {};
      const reports = Array.isArray(settings.reports) ? settings.reports : [];

      const action = req.body?.action || 'run';
      if (action === 'save') {
        const item = {
          id: `rep_${Date.now()}`,
          name: req.body?.name || 'Saved report',
          query: req.body?.query || { type: 'kpis' },
          createdAt: new Date().toISOString()
        };
        const next = { ...settings, reports: [item, ...reports] };
        await prisma.organization.update({ where: { id: req.user.organizationId }, data: { settings: next } });
        return res.status(201).json(success(item, 'Report saved'));
      }

      // built-in demo reports
      const type = req.body?.type || req.body?.query?.type || 'kpis';
      if (type === 'kpis') {
        const [totalLeads, qualified, hot, deals] = await Promise.all([
          prisma.lead.count({ where: { organizationId: req.user.organizationId, OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] } }),
          prisma.lead.count({ where: { organizationId: req.user.organizationId, isQualified: true, OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] } }),
          prisma.lead.count({ where: { organizationId: req.user.organizationId, status: 'HOT', OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }] } }),
          prisma.deal.count({ where: { lead: { organizationId: req.user.organizationId } } })
        ]);
        return res.json(success({ type, metrics: { totalLeads, qualified, hot, deals } }, 'Report generated'));
      }

      return res.json(success({ type, message: 'Unknown report type. Try type=kpis.' }, 'Report generated'));
    }

    // Default: mark as implemented for demo and echo.
    return res.json(success({ feature, status: 'implemented', message: 'Feature enabled for demo. Extend as needed.' }));
  } catch (error) {
    return res.status(500).json(failure('SERVER_ERROR', error.message));
  }
}

module.exports = { getFeature, postFeature };

