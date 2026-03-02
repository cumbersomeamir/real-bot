function parseUTM(query = {}) {
  return {
    utmSource: query.utm_source || null,
    utmMedium: query.utm_medium || null,
    utmCampaign: query.utm_campaign || null,
    utmContent: query.utm_content || null,
    utmTerm: query.utm_term || null
  };
}

module.exports = { parseUTM };
