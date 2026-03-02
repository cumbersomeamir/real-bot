function runReportGenerator() {
  return { ranAt: new Date().toISOString(), job: 'reportGenerator' };
}

module.exports = { runReportGenerator };
