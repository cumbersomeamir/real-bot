function runStaleLeadCheck() {
  return { ranAt: new Date().toISOString(), job: 'staleLeadCheck' };
}

module.exports = { runStaleLeadCheck };
