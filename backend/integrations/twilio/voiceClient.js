async function triggerVoiceCall(payload) {
  return { id: `voice_${Date.now()}`, status: 'queued', payload };
}

module.exports = { triggerVoiceCall };
