const env = require('../../config/env');

function hasTwilioSmsConfig() {
  return Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_PHONE_NUMBER);
}

async function sendSMS(payload) {
  const to = payload?.to;
  const body = payload?.content;
  if (!to) throw new Error('SMS recipient phone missing');
  if (!body) throw new Error('SMS content missing');

  if (!hasTwilioSmsConfig()) {
    return { id: `sms_mock_${Date.now()}`, status: 'delivered', delivered: true, payload, mode: 'mock' };
  }

  const twilio = require('twilio');
  const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  const msg = await client.messages.create({
    to,
    from: env.TWILIO_PHONE_NUMBER,
    body
  });
  return { id: msg.sid, status: 'delivered', delivered: true, response: { status: msg.status }, mode: 'twilio' };
}

module.exports = { sendSMS, hasTwilioSmsConfig };
