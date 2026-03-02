const analyticsService = require('../services/analyticsService');
const prisma = require('../config/database');
const { success } = require('../utils/response');

async function overview(req, res) {
  const data = await analyticsService.getOverview(prisma, req.user.organizationId);
  return res.json(success(data));
}

async function funnel(req, res) {
  const data = await analyticsService.getFunnel(prisma, req.user.organizationId);
  return res.json(success(data));
}

async function revenue(req, res) {
  const data = await analyticsService.getRevenue(prisma, req.user.organizationId);
  return res.json(success(data));
}

async function campaigns(req, res) {
  const data = await analyticsService.getCampaigns(prisma, req.user.organizationId);
  return res.json(success(data));
}

async function sources(req, res) {
  const data = await analyticsService.getSources(prisma, req.user.organizationId);
  return res.json(success(data));
}

async function brokers(req, res) {
  const data = await analyticsService.getBrokers(prisma, req.user.organizationId);
  return res.json(success(data));
}

async function forecast(req, res) {
  const data = await analyticsService.getForecast(prisma, req.user.organizationId);
  return res.json(success(data));
}

async function leakage(req, res) {
  const data = await analyticsService.getLeakage(prisma, req.user.organizationId);
  return res.json(success(data));
}

module.exports = {
  overview,
  funnel,
  revenue,
  campaigns,
  sources,
  brokers,
  forecast,
  leakage
};
