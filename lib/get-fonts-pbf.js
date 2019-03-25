const { map, detectSeries } = require('async');
const { join } = require('path');
const { readFile } = require('fs');

const { combine } = require('@mapbox/glyph-pbf-composite');

const debug = require('debug')('map-glyph-server');

module.exports = getFontsPbf;

function getFontPbf(fontPath, choices, range, fn) {
  debug('Looking for', choices[0], range);
  let pbf;
  let checked = {};

  detectSeries(choices, loadFont, function(err) {
    if (err) { return fn(err); }
    fn(err, pbf);
  });

  function loadFont(name, fn) {
    const filename = join(fontPath, name, `${range}.pbf`);

    if (checked[filename]) {
      return fn(null, false);
    }

    readFile(filename, function (err, data) {
      checked[filename] = true;
      if (err) {
        debug('Font not found:', name);
        fn(null, false);
      } else {
        debug('Font found:', name);
        pbf = data;
        fn(null, true);
      }
    });
  }
}

function getFontsPbf (fontPath, fonts, range, fallbacks, fn) {
  map(fonts,
    (font, fn) => getFontPbf(fontPath, [font, ...fallbacks], range, fn),
    (err, pbfs) => {
      if (err) { return fn(err); }
      // only non-empty fonts are OK
      pbfs = pbfs.filter(p => p && p.length);
      if (pbfs.length < fonts.length) { return fn(404); }
      let result = pbfs.length > 1 ? combine(pbfs) : pbfs[0];
      fn(null, result);
  });
}
