const test = require('node:test');
const assert = require('node:assert/strict');
const findFonts = require('../lib/find-fonts');

test('find all fonts directories', function (t, done) {
  findFonts(`${__dirname}/fixtures`, function(err, fonts) {
    assert.ifError(err);
    assert.deepEqual(fonts, {
      'Metropolis Black': true,
      'Open Sans Bold': true,
      'Open Sans Regular': true
    });
    done();
  });
});
