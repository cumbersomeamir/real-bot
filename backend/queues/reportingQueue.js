const { createQueue } = require('./shared');

const reportingQueue = createQueue('reporting');

module.exports = reportingQueue;
