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
      incrementByIssueCount(byIssue, record);
      incrementByMonthCount(byMonth, record, year, month);
    });
  });

  titles.sort((t1, t2) => t1.title.localeCompare(t2.title));
  fs.writeFileSync(paths.titleIndexFile(), JSON.stringify(titles, null, 2));

  Object.keys(byIssue)
    .forEach(function(id) {
      var outputFile = paths.titleByIssueFile(id);

      byIssue[id].records.sort(byIncreasingIssue);
      writeDataset(outputFile, byIssue[id]);
    });

  Object.keys(byMonth)
    .forEach(function(id) {
      var outputFile = paths.titleByMonthFile(id);

      byMonth[id].records.sort(byIncreasingDate);
      writeDataset(outputFile, byMonth[id]);
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

function incrementByIssueCount(byIssue, record) {
  var {id, title, publisher, issue, count} = record;

  if (!byIssue[id]) {
    byIssue[id] = {
      records: [],
      id,
      title,
      publisher
    };
  }

  var issueRecords = byIssue[id].records;

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

function incrementByMonthCount(byMonth, record, year, month) {
  var {id, title, publisher, count} = record;

  if (!byMonth[id]) {
    byMonth[id] = {
      records: [],
      id,
      title,
      publisher
    };
  }

  var monthRecords = byMonth[id].records;

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
