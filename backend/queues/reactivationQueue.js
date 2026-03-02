const { createQueue } = require('./shared');

const reactivationQueue = createQueue('reactivation');

module.exports = reactivationQueue;
