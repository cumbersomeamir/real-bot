function success(data = {}, message = 'Success', meta = {}) {
  return { success: true, data, message, meta };
}

function failure(code = 'INTERNAL_ERROR', message = 'Something went wrong', details = []) {
  return { success: false, error: { code, message, details } };
}

module.exports = { success, failure };
