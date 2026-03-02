function attributeLead(lead) {
  return {
    campaign: lead.utmCampaign || lead.sourceDetail || 'unattributed',
    source: lead.utmSource || lead.source || 'unknown'
  };
}

module.exports = { attributeLead };
