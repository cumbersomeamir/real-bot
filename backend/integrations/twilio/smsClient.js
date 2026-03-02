async function sendSMS(payload) {
  return { id: `sms_${Date.now()}`, status: 'queued', payload };
}

module.exports = { sendSMS };
