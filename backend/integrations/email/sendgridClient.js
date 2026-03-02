const env = require('../../config/env');

function hasSendgridConfig() {
  return Boolean(env.SENDGRID_API_KEY && env.SENDGRID_FROM_EMAIL);
}

async function sendEmail(payload) {
  const to = payload?.email;
  const content = payload?.content;
  if (!to) throw new Error('Email recipient missing');
  if (!content) throw new Error('Email content missing');

  if (!hasSendgridConfig()) {
    return { id: `email_mock_${Date.now()}`, status: 'delivered', delivered: true, payload, mode: 'mock' };
  }

  const sg = require('@sendgrid/mail');
  sg.setApiKey(env.SENDGRID_API_KEY);

  const msg = {
    to,
    from: env.SENDGRID_FROM_EMAIL,
    subject: payload?.subject || 'DealFlow AI',
    text: content
  };

  const [resp] = await sg.send(msg);
  const id = resp?.headers?.['x-message-id'] || `email_${Date.now()}`;
  return { id, status: 'delivered', delivered: true, mode: 'sendgrid' };
}

module.exports = { sendEmail, hasSendgridConfig };
