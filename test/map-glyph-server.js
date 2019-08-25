process.env.MAP_GLYPH_SERVER_FONT_PATH = __dirname + '/fixtures';
process.env.MAP_GLYPH_SERVER_CACHE_MAX_AGE = 2592000;

const request = require('supertest');
const app = require('..');
const tape = require('tape');
const test = require('tape-promise').default(tape);

/*
75651 fixtures/Metropolis Black/0-255.pbf
45992 fixtures/Metropolis Black/256-511.pbf
80025 fixtures/Open Sans Bold/0-255.pbf
74696 fixtures/Open Sans Regular/0-255.pbf
*/

test('return /fonts.json', function (t) {
  return request(app)
    .get('/fonts.json')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => t.same(response.body, [
          'Metropolis Black',
          'Open Sans Bold',
          'Open Sans Regular'
    ]));
});

test('return a specific font', function () {
  return request(app)
    .get('/fonts/Metropolis%20Black/0-255.pbf')
    .expect('Content-Type', 'application/x-protobuf')
    .expect('Content-Length', '75651')
    .expect(200);
});


test('return a specific font', function () {
  return request(app)
    .get('/fonts/Metropolis%20Black/0-255.pbf')
    .expect('Content-Type', 'application/x-protobuf')
    .expect('Content-Length', '75651')
    .expect('Cache-Control', 'public, max-age=2592000')
    .expect(200);
});

test('return a fallback font for invalid name', function () {
  return request(app)
    .get('/fonts/Open%20Sans%20XXXX/256-511.pbf')
    .expect('Content-Type', 'application/x-protobuf')
    .expect('Content-Length', '45992')
    .expect(200);
});

test('combines fonts if needed', function() {
  return request(app)
    .get('/fonts/Metropolis%20Black,Open%20Sans%20Bold/0-255.pbf')
    .expect('Content-Type', 'application/x-protobuf')
    .expect(200);
});
