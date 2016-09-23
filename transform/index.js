var slugger = require('slugger');

module.exports = transform;

/**
 * Convert raw records from the web scrape into usable records.
 *
 * @param  {Object[]} rawRecords
 * @return {Object[]}
 */
function transform(rawRecords) {
  return rawRecords
    .filter(isUsable)
    .map(transformRecord);
}

function transformRecord(usableRecord) {
  return {
    id: makeId(usableRecord),
    rank: makeRank(usableRecord),
    title: makeTitle(usableRecord),
    issue: makeIssue(usableRecord),
    price: makePrice(usableRecord),
    publisher: makePublisher(usableRecord),
    count: makeCount(usableRecord)
  };
}

function isUsable(rawRecord) {
  // spacing rows and some trade paperbacks
  if (rawRecord.issue == null) return false;
  // header rows
  if (rawRecord.issue == 'Issue') return false;
  if (rawRecord.issue == 'Price') return false;
  // trade paperbacks
  if (rawRecord.issue == 'NEW') return false;
  // trade paperbacks
  if (rawRecord.issue.match(/^\d{1,2}\/\d{4}$/)) return false;
  // trade paperbacks
  if (rawRecord.issue[0] == '$') return false;
  // trade paperbacks (it's a price but there wasn't a dollar sign)
  if (rawRecord.issue.match(/^\d+\.\d{2}$/)) return false;
  // one shots and some other weird unusable data
  if (rawRecord.issue.trim() == '') return false;

  return !isNaN(firstPartAsNumber(rawRecord.issue));
}

function makeRank(usableRecord) {
  return parseInt(usableRecord.rank, 10);
}

function makeTitle(usableRecord) {
  var title = usableRecord.title;
  return title.replace(/\n/g, ' ').trim();
}

function makeCount(usableRecord) {
  var count = usableRecord.count.replace(/,/g, '');
  return parseInt(count, 10);
}

function makeId(usableRecord) {
  var raw = makeTitle(usableRecord) + '-' + makePublisher(usableRecord);
  return slugger(raw, {
    decode: false
  });
}

function makeIssue(usableRecord) {
  return firstPartAsNumber(usableRecord.issue);
}

function firstPartAsNumber(issue) {
  var firstPart = issue.split(/\s+/)[0];

  if (firstPart == '1/2') return 0.5;
  if (firstPart == '1 1/2') return 1.5;
  // "oh" instead of zero? seen for "Universe X" in July 2000
  if (firstPart == 'O') return 0;

  return parseInt(firstPart, 10);
}

function makePublisher(usableRecord) {
  return usableRecord.publisher.trim();
}

function makePrice(usableRecord) {
  return usableRecord.price;
}