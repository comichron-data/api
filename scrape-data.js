var fs = require('fs');
var through2 = require('through2');
var slugger = require('slugger');

var paths = require('./paths');
var transformRecords = require('./transform');

var x = require('x-ray')();

// [month, year] or [year]
var chunk1 = [
  [9, 1996],
  [10, 1996],
  [11, 1996],
  [12, 1996],
  [1997],
  [1998],
  [1999],
  [2000]
];

var chunk2 = [
  [2001],
  [2002],
  [2003],
  [2004],
  [2005]
];

var chunk3 = [
  [2006],
  [2007],
  [2008],
  [2009],
  [2010]
];

var chunk4 = [
  [2011],
  [2012],
  [2013],
  [2014],
  [2015],
  [2016]
];

var chunk5 = [
  [1, 2017],
  [2, 2017]
];

var dates = chunk5;

ingestData(expandDates(dates));

function ingestData(dates) {
  return dates.map(function([month, year]) {
    var outputFile = paths.sourceDataFile(month, year);

    var recordsArrayStream = xrayStream(month, year)
      .pipe(fromJson())
      .pipe(cleanUp())
      .pipe(toJson())
      .pipe(fs.createWriteStream(outputFile))
      .on('error', function(e) {
        console.error(outputFile, e)
      })
      .on('close', function() {
        console.log(`wrote ${outputFile}`);
      });
  });
}

function xrayStream(month, year) {
  if (!canGetDataFor(month, year)) {
    throw new Error(`Cannot get data for ${month}/${year}`);
  }

  var url = getUrl(month, year);

  console.log(`hitting ${url}`);

  return x(url, '#Top300Comics tr', [{
    rank:      'td:nth-of-type(1)',
    title:     'td:nth-of-type(3) a',
    issue:     'td:nth-of-type(4)',
    price:     'td:nth-of-type(5)',
    publisher: 'td:nth-of-type(6)',
    count:     'td:nth-of-type(7) strong'
  }]).stream();
}

function toJson() {
  return through2.obj(function toJsonTransform(chunk, encoding, callback) {
    try {
      return callback(null, JSON.stringify(chunk, null, 2));
    } catch (e) {
      return callback(e);
    }
  });
}

function fromJson() {
  return through2.obj(function fromJsonTransform(chunk, encoding, callback) {
    try {
      return callback(null, JSON.parse(chunk.toString()));
    } catch (e) {
      return callback(e);
    }
  });
}

function cleanUp() {
  return through2.obj(function cleanUpTransform(records, encoding, callback) {
    try {
      var cleaned = transformRecords(records);
      return callback(null, cleaned);
    } catch (e) {
      console.error(e)

      return callback(e);
    }
  });
}

function getUrl(month, year) {
  var paddedMonth = zeroPadMonth(month);
  return `http://www.comichron.com/monthlycomicssales/${year}/${year}-${paddedMonth}.html`;
}

function canGetDataFor(month, year) {
  return year > 1996 || (year == 1996 && month > 8);
}

function zeroPadMonth(month) {
  var string = month.toString();
  return string.length == 1 ? '0' + string : string;
}

function expandDates(dates) {
  var result = dates.map(function(date) {
    if (date.length == 1) {
      let year = date[0];
      return [
        [1, year],
        [2, year],
        [3, year],
        [4, year],
        [5, year],
        [6, year],
        [7, year],
        [8, year],
        [9, year],
        [10, year],
        [11, year],
        [12, year]
      ];
    } else {
      // need to wrap in extra array so the unwrap step works at the end
      return [date];
    }
  });

  return Array.prototype.concat.apply([], result);
}