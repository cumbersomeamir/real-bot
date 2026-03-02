function getOverview() {
  return {
    totalLeads: 2840,
    hotLeadsPct: 12.7,
    qualifiedLeadsPct: 44.3,
    avgResponseTime: '2m 47s',
    siteVisits: 214,
    costPerLead: 2140,
    costPerDeal: 38200,
    pipelineForecast: 316000000,
    leakagePct: 11.8
  };
}

function getFunnel() {
  return {
    stages: [
      ['Captured', 2840],
      ['Qualified', 1260],
      ['Hot', 362],
      ['Site Visit', 214],
      ['Negotiation', 86],
      ['Closed', 41]
    ]
  };
}

function getRevenue() {
  return {
    trend: [
      { day: 'D-30', revenue: 7200000 },
      { day: 'D-15', revenue: 9800000 },
      { day: 'Today', revenue: 13400000 }
    ]
  };
}

function getCampaigns() {
  return {
    items: [
      { campaign: 'Meta West Pune', spend: 1200000, deals: 12, roi: 4.6 },
      { campaign: 'Google Baner Search', spend: 650000, deals: 8, roi: 5.2 }
    ]
  };
}

function getSources() {
  return {
    items: [
      { source: 'META_ADS', leads: 1200, conversion: 2.8 },
      { source: 'GOOGLE_ADS', leads: 820, conversion: 3.4 },
      { source: 'INDIAMART', leads: 260, conversion: 1.9 }
    ]
  };
}

function getBrokers() {
  return {
    items: [
      { broker: 'Aman Shah', responseTime: '3m 10s', conversion: 14.2 },
      { broker: 'Ritu Singh', responseTime: '4m 05s', conversion: 12.1 }
    ]
  };
}

function getForecast() {
  return {
    projection: 22100000,
    confidence: 0.82,
    lowerBound: 18400000,
    upperBound: 26500000
  };
}

function getLeakage() {
  return {
    leakagePct: 11.8,
    noFollowUpLeads: 336,
    estimatedRecoverable: 42000000
  };
}

module.exports = {
  getOverview,
  getFunnel,
  getRevenue,
  getCampaigns,
  getSources,
  getBrokers,
  getForecast,
  getLeakage
};
