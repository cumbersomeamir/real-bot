async function sendWhatsAppMessage(payload) {
  return { id: `wa_${Date.now()}`, status: 'queued', payload };
}

module.exports = { sendWhatsAppMessage };
