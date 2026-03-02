function runDataRetentionCleanup() {
  return { ranAt: new Date().toISOString(), job: 'dataRetentionCleanup' };
}

module.exports = { runDataRetentionCleanup };
