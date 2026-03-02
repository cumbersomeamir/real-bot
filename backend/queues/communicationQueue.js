const { createQueue } = require('./shared');

const communicationQueue = createQueue('communication', { max: 80, duration: 1000 });

module.exports = communicationQueue;
