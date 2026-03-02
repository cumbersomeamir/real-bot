function processMetaWebhook(payload) {
  return { source: 'meta', accepted: true, payload };
}

module.exports = { processMetaWebhook };
