const { createQueue } = require('./shared');

const voiceCallQueue = createQueue('voiceCall', { max: 40, duration: 1000 });

module.exports = voiceCallQueue;
