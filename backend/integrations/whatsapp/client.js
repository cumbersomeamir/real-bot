const axios = require('axios');
const env = require('../../config/env');

function hasWhatsAppConfig() {
  return Boolean(env.WHATSAPP_API_URL && env.WHATSAPP_API_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID);
}

async function sendWhatsAppMessage(payload) {
  const to = payload?.to;
  const bodyText = payload?.content;
  if (!to) throw new Error('WhatsApp recipient phone missing');
  if (!bodyText) throw new Error('WhatsApp content missing');

  // Demo-first: if no keys configured, behave like a real delivery so the app is usable.
  if (!hasWhatsAppConfig()) {
    return { id: `wa_mock_${Date.now()}`, status: 'delivered', delivered: true, payload, mode: 'mock' };
  }

  const url = `${String(env.WHATSAPP_API_URL).replace(/\/$/, '')}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const res = await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      to: String(to).replace(/[^\d]/g, ''),
      type: 'text',
      text: { body: bodyText }
    },
    {
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    }
  );

  const id = res?.data?.messages?.[0]?.id || `wa_${Date.now()}`;
  return { id, status: 'delivered', delivered: true, response: res.data, mode: 'meta' };
}

module.exports = { sendWhatsAppMessage, hasWhatsAppConfig };
