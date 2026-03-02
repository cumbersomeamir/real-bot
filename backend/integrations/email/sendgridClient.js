async function sendEmail(payload) {
  return { id: `email_${Date.now()}`, status: 'queued', payload };
}

module.exports = { sendEmail };
