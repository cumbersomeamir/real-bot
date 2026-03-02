const CryptoJS = require('crypto-js');
const env = require('../config/env');

const key = env.ENCRYPTION_KEY || 'default-key-change-me';

function encrypt(value) {
  if (!value) return value;
  return CryptoJS.AES.encrypt(value, key).toString();
}

function decrypt(cipherText) {
  if (!cipherText) return cipherText;
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt };
