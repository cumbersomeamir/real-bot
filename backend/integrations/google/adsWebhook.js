function processGoogleWebhook(payload) {
  return { source: 'google', accepted: true, payload };
}

module.exports = { processGoogleWebhook };
