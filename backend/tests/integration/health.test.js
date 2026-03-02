const request = require('supertest');
const app = require('../../app');

describe('GET /health', () => {
  it('returns ok', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
