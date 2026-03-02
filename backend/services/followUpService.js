async function triggerFollowUp(leadId) {
  return {
    leadId,
    triggered: true,
    sequence: [0, 2, 5, 10, 15, 30]
  };
}

module.exports = { triggerFollowUp };
