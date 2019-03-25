const test = require('tape');
const findFonts = require('../lib/find-fonts');

test('find all fonts directories', function (t) {
  findFonts(`${__dirname}/fixtures`, function(err, fonts) {
    t.error(err);
    t.same(fonts, {
      'Metropolis Black': true,
      'Open Sans Bold': true,
      'Open Sans Regular': true
    });
    t.end();
  });
});
