const test = require('node:test');
const assert = require('node:assert/strict');
const findFonts = require('../lib/find-fonts');

test('find all fonts directories', async function () {
  const fonts = await findFonts(`${__dirname}/fixtures`);
  assert.deepEqual(fonts, {
    'Metropolis Black': true,
    'Open Sans Bold': true,
    'Open Sans Regular': true
  });
});
