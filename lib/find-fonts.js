const path = require('node:path');
const readdir = require('@folder/readdir');

const debug = require('debug')('map-glyph-server');


module.exports = findFonts;

const memo = Object.create(null);

function findFonts(fontPath) {
  let p = memo[fontPath];
  if (!p) {
    memo[fontPath] = p = findFontsImplementation(fontPath);
  }
  return p;
}

async function findFontsImplementation(fontPath) {
  debug('Looking for fonts in:', fontPath);
  const fonts = {};
  const files = await readdir(fontPath, {
    nodir: true,
    recursive: true,
    follow: true
  });
  files.forEach(name => {
    const { dir, base } = path.parse(name);
    if (base === '0-255.pbf' && !dir.includes(path.separator)) {
      debug('Found font', dir);
      fonts[dir] = true;
    }
  });
  return fonts;
}
