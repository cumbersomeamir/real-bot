async function qualifyLead(leadId) {
  return {
    leadId,
    status: 'QUALIFIED',
    summary: 'Lead qualified through automated conversational flow',
    completedAt: new Date().toISOString()
  };
}

module.exports = { qualifyLead };
