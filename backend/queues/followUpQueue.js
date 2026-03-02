const { createQueue } = require('./shared');

const followUpQueue = createQueue('followUp', { max: 200, duration: 1000 });

module.exports = followUpQueue;
