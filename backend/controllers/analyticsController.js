const analyticsService = require('../services/analyticsService');
const { success } = require('../utils/response');

function overview(req, res) {
  return res.json(success(analyticsService.getOverview()));
}

function funnel(req, res) {
  return res.json(success(analyticsService.getFunnel()));
}

function revenue(req, res) {
  return res.json(success(analyticsService.getRevenue()));
}

function campaigns(req, res) {
  return res.json(success(analyticsService.getCampaigns()));
}

function sources(req, res) {
  return res.json(success(analyticsService.getSources()));
}

function brokers(req, res) {
  return res.json(success(analyticsService.getBrokers()));
}

function forecast(req, res) {
  return res.json(success(analyticsService.getForecast()));
}

function leakage(req, res) {
  return res.json(success(analyticsService.getLeakage()));
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
