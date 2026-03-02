function isValidIndianPhone(phone = '') {
  return /^(\+91)?[6-9]\d{9}$/.test(phone);
}

module.exports = { isValidIndianPhone };
