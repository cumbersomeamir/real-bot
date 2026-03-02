function toStructuredOutput(raw) {
  return {
    summary: raw,
    confidence: 0.75
  };
}

module.exports = { toStructuredOutput };
