function isDuplicate(existing = [], incoming = {}) {
  return existing.some((lead) => lead.phone === incoming.phone || (lead.email && lead.email === incoming.email));
}

module.exports = { isDuplicate };
