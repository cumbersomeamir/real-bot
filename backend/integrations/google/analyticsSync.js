async function syncGoogleAnalytics() {
  return { synced: true, at: new Date().toISOString() };
}

module.exports = { syncGoogleAnalytics };
