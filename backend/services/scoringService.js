function scoreLead(lead) {
  const budget = lead?.budgetRange?.max ? 30 : 10;
  const urgency = lead?.timeline === 'immediate' ? 30 : 15;
  const engagement = lead?.isQualified ? 25 : 10;
  const source = lead?.source === 'META_ADS' || lead?.source === 'GOOGLE_ADS' ? 15 : 8;
  const score = Math.min(100, budget + urgency + engagement + source);
  return {
    score,
    scoreBreakdown: { budget, urgency, engagement, source }
  };
}

module.exports = { scoreLead };
