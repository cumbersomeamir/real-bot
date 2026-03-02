const { createQueue } = require('./shared');

const leadProcessingQueue = createQueue('leadProcessing');

module.exports = leadProcessingQueue;
