const { join } = require('path');
const { readFile } = require('node:fs/promises');

const { combine } = require('@mapbox/glyph-pbf-composite');

const debug = require('debug')('map-glyph-server');

module.exports = getFontsPbf;

async function getFontPbf(fontPath, choices, range) {
  debug('Looking for', choices[0], range);
  let checked = Object.create(null);

  for (const name of choices) {
    const pbf = await loadFont(name);
    if (pbf) {
      return pbf;
    }
  }

  async function loadFont(name) {
    const filename = join(fontPath, name, `${range}.pbf`);

    if (checked[filename]) {
      return;
    }
    try {
      const data = await readFile(filename);
      debug('Font found:', name);
      return data;
    } catch {
      debug('Font not found:', name);
      checked[filename] = true;
    }
  }
}

async function getFontsPbf(fontPath, fonts, range, fallbacks) {
  let pbfs = await Promise.all(
    fonts.map(font => getFontPbf(fontPath, [font, ...fallbacks], range))
  );
  // only non-empty fonts are OK
  pbfs = pbfs.filter(p => p?.length);
  debug(pbfs);
  if (pbfs.length < fonts.length) {
    console.log('here');
    throw 404;
  }
  let result = pbfs.length > 1 ? combine(pbfs) : pbfs[0];
  return result;
}
