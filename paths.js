var path = require('path');

var apiPath = __dirname;
var sourceDataPath = path.resolve(apiPath, 'source-data');
var titlesPath = path.resolve(apiPath, 'titles');

module.exports = {
  titleByMonthFile,
  titleByIssueFile,
  titleIndexFile,
  sourceDataFile,
  sourceDataDirectory,
  dateFromSourceFilename
};

function titleDirectory(titleId) {
  return path.resolve(titlesPath, titleId);
}

function titleByMonthFile(titleId) {
  return path.resolve(titleDirectory(titleId), 'by-month.json');
}

function titleByIssueFile(titleId) {
  return path.resolve(titleDirectory(titleId), 'by-issue.json');
}

function titleIndexFile() {
  return path.resolve(apiPath, 'titles.json');
}

function sourceDataFile(month, year) {
  var paddedMonth = zeroPadMonth(month);
  return path.resolve(sourceDataPath, `${year}-${paddedMonth}.json`);
}

function sourceDataDirectory() {
  return sourceDataPath;
}

function zeroPadMonth(month) {
  var string = month.toString();
  return string.length == 1 ? '0' + string : string;
}

function dateFromSourceFilename(sourceFilename) {
  return sourceFilename.match(/(\d{4})-(\d{2})\.json/)
    .slice(1, 3)
    .map(g => parseInt(g, 10));
}