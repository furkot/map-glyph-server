const { readdir, stat } = require('node:fs/promises');
const { join } = require('node:path');

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
  const dirs = await readdir(fontPath, { withFileTypes: true });
  const fonts = {};
  await Promise.all(
    dirs.filter(d => d.isDirectory() || d.isSymbolicLink()).map(checkDir)
  );
  return fonts;

  async function checkDir({ name, parentPath }) {
    const filename = join(parentPath, name, '0-255.pbf');
    const st = await stat(filename).catch(() => null);
    if (st?.isFile()) {
      debug('Found font', name);
      fonts[name] = true;
    }
  }
}
