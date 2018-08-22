var should = require('should');
var findFonts = require('../lib/find-fonts');

describe('find fonts', function () {
  it('find all fonts directories', function (done) {
    findFonts(__dirname + '/fixtures', function(err, fonts) {
      should.not.exist(err);
      should.exist(fonts);
      fonts.should.eql({
        'Metropolis Black': true,
        'Open Sans Bold': true,
        'Open Sans Regular': true
      });
      done();
    });
  });
});
