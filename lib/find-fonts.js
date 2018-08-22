const path = require('path');
const findit = require('findit');
const { memoize } = require('async');

const debug = require('debug')('map-glyph-server');

module.exports = memoize(findFontsImplementation, pathname => pathname);

function findFontsImplementation(fontPath, fn) {
  debug('Looking for fonts in:', fontPath);
  const fonts = {};
  const f = findit(fontPath, { followSymlinks: true });
  f.on('file', function(name) {
    const { dir, base } = path.parse(name);
    if (base ===  '0-255.pbf') {
      const font = dir.slice(fontPath.length + 1);
      if (!font.includes(path.separator)) {
        fonts[font] = true;
        debug('Found font', font);
      }
    }
  });
  f.on('end', () => fn(null, fonts));
  f.on('error', fn);
}
