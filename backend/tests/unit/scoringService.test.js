const { scoreLead } = require('../../services/scoringService');

describe('scoreLead', () => {
  it('returns bounded score', () => {
    const result = scoreLead({ budgetRange: { max: 10000000 }, timeline: 'immediate', isQualified: true, source: 'META_ADS' });
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.score).toBeGreaterThan(0);
  });
});
