function geoTag(phone = '') {
  if (phone.startsWith('+9198') || phone.startsWith('98')) return { city: 'Mumbai', area: 'Western Suburbs' };
  if (phone.startsWith('+9197') || phone.startsWith('97')) return { city: 'Pune', area: 'West' };
  return { city: 'Unknown', area: 'Unknown' };
}

module.exports = { geoTag };
