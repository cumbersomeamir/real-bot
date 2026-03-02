const Papa = require('papaparse');

function parseCSV(content) {
  return Papa.parse(content, { header: true, skipEmptyLines: true });
}

module.exports = { parseCSV };
