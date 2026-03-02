const env = require('../../config/env');

function hasTwilioVoiceConfig() {
  return Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_PHONE_NUMBER);
}

async function triggerVoiceCall(payload) {
  const to = payload?.to;
  if (!to) throw new Error('Voice recipient phone missing');

  if (!hasTwilioVoiceConfig()) {
    return { id: `voice_mock_${Date.now()}`, status: 'delivered', delivered: true, payload, mode: 'mock' };
  }

  const twilio = require('twilio');
  const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  const call = await client.calls.create({
    to,
    from: env.TWILIO_PHONE_NUMBER,
    // simple demo: TwiML bin / placeholder
    twiml: `<Response><Say voice="alice">Hello from DealFlow AI. This is a demo call.</Say></Response>`
  });
  return { id: call.sid, status: 'delivered', delivered: true, response: { status: call.status }, mode: 'twilio' };
}

module.exports = { triggerVoiceCall, hasTwilioVoiceConfig };
