function runDailyDigest() {
  return { ranAt: new Date().toISOString(), job: 'dailyDigest' };
}

module.exports = { runDailyDigest };
