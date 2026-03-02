function forecastPipeline(records = []) {
  const total = records.reduce((sum, item) => sum + (item.value || 0), 0);
  return {
    forecast: total * 1.1,
    confidence: 0.78
  };
}

module.exports = { forecastPipeline };
