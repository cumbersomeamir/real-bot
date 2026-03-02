function handleWhatsAppWebhook(body) {
  return { received: true, body };
}

module.exports = { handleWhatsAppWebhook };
