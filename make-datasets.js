var path = require('path');
var fs = require('fs');

var glob = require('glob');
var mkdirp = require('mkdirp');

var paths = require('./paths');

var byMonth = {};
var byIssue = {};
var titles = [];

var pattern = path.join(paths.sourceDataDirectory(), '*.json');
glob(pattern, function(err, filenames) {
  filenames.forEach(function(filename) {
    var json = fs.readFileSync(filename);
    var records = JSON.parse(json);

    var [year, month] = paths.dateFromSourceFilename(filename);

    records.forEach(function(record) {
      ensureTitle(titles, record.id, record.title, record.publisher);
      incrementByIssueCount(byIssue, record.id, record.issue, record.count);
      incrementByMonthCount(byMonth, record.id, year, month, record.count);
    });
  });

  titles.sort((t1, t2) => t1.title.localeCompare(t2.title));
  fs.writeFileSync(paths.titleIndexFile(), JSON.stringify(titles, null, 2));

  Object.keys(byIssue)
    .forEach(function(id) {
      var outputFile = paths.titleByIssueFile(id);
      var issueRecords = byIssue[id].sort(byIncreasingIssue);

      writeDataset(outputFile, issueRecords);
    });

  Object.keys(byMonth)
    .forEach(function(id) {
      var outputFile = paths.titleByMonthFile(id);
      var monthRecords = byMonth[id].sort(byIncreasingDate);

      writeDataset(outputFile, monthRecords);
    });
});

function writeDataset(file, data) {
  mkdirp(path.dirname(file), function(err) {
    if (err) throw err;

    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log('wrote ' + file);
  });
}

function ensureTitle(titles, id, title, publisher) {
  var index = titles.findIndex(t => t.id == id);

  if (index == -1) {
    titles.push({
      id,
      title,
      publisher
    });
  }
}

function incrementByIssueCount(byIssue, id, issue, count) {
  var issueRecords = byIssue[id] || (byIssue[id] = []);

  var index = issueRecords.findIndex(r => r.issue == issue);
  if (index == -1) {
    issueRecords.push({
      issue,
      count
    });
  } else {
    issueRecords[index].count += count;
  }
}

function incrementByMonthCount(byMonth, id, year, month, count) {
  var monthRecords = byMonth[id] || (byMonth[id] = []);

  var index = monthRecords.findIndex(r => r.year == year && r.month == month);
  if (index == -1) {
    monthRecords.push({
      year,
      month,
      count
    });
  } else {
    monthRecords[index].count += count;
  }
}

function byIncreasingDate(r1, r2) {
  var yearDiff = r1.year - r2.year;

  if (yearDiff != 0) {
    return yearDiff;
  } else {
    return r1.month - r2.month;
  }
}

function byIncreasingIssue(r1, r2) {
  return r1.issue - r2.issue;
}
