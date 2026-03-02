const Papa = require('papaparse');

function parseIndiaMartCSV(csvString) {
  return Papa.parse(csvString, { header: true, skipEmptyLines: true });
}

module.exports = { parseIndiaMartCSV };
