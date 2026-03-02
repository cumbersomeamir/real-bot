const { createQueue } = require('./shared');

const scoringQueue = createQueue('scoring', { max: 300, duration: 1000 });

module.exports = scoringQueue;
