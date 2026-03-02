async function startCampaign(payload) {
  return {
    campaignId: `react-${Date.now()}`,
    inputSize: payload?.leadCount || 0,
    status: 'started'
  };
}

module.exports = { startCampaign };
