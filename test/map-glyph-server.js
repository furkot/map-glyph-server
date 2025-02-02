process.env.MAP_GLYPH_SERVER_FONT_PATH = __dirname + '/fixtures';
process.env.MAP_GLYPH_SERVER_CACHE_MAX_AGE = 2592000;

const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');

const { makeFetch } = require('supertest-fetch');
const app = require('..');

/*
75651 fixtures/Metropolis Black/0-255.pbf
45992 fixtures/Metropolis Black/256-511.pbf
80025 fixtures/Open Sans Bold/0-255.pbf
74696 fixtures/Open Sans Regular/0-255.pbf
*/

const fetch = makeFetch(createServer(app));

test('return /fonts.json', async function () {
  const res = await fetch('/fonts.json')
    .expect('Content-Type', /json/)
    .expect(200);

  const body = await res.json();

  assert.deepEqual(body, [
    'Metropolis Black',
    'Open Sans Bold',
    'Open Sans Regular'
  ]);
});

test('return a specific font', function () {
  return fetch('/fonts/Metropolis%20Black/0-255.pbf')
    .expect('Content-Type', 'application/x-protobuf')
    .expect('Content-Length', '75651')
    .expect('Cache-Control', 'public, max-age=2592000')
    .expect('Etag', '"12783-O+uYHa1nljeTWqe1xiWgzTqMMDk"')
    .expect(200);
});

test('return a specific font again if no etag', function () {
  return fetch('/fonts/Metropolis%20Black/0-255.pbf')
    .expect('Content-Type', 'application/x-protobuf')
    .expect('Content-Length', '75651')
    .expect('Cache-Control', 'public, max-age=2592000')
    .expect('Etag', '"12783-O+uYHa1nljeTWqe1xiWgzTqMMDk"')
    .expect(200);
});

test('return a specific font again if etag does not match', function () {
  return fetch('/fonts/Metropolis%20Black/0-255.pbf', {
    headers: {
      'If-None-Match': '"XXX"', // different etag
      'Cache-Control': ''
    }
  })
    .expect('Content-Type', 'application/x-protobuf')
    .expect('Content-Length', '75651')
    .expect('Cache-Control', 'public, max-age=2592000')
    .expect('Etag', '"12783-O+uYHa1nljeTWqe1xiWgzTqMMDk"')
    .expect(200);
});

test('return not modified if etag matches', function () {
  return fetch('/fonts/Metropolis%20Black/0-255.pbf', {
    headers: {
      'If-None-Match': '"12783-O+uYHa1nljeTWqe1xiWgzTqMMDk"',
      'Cache-Control': ''
    }
  })
    .expect('Cache-Control', 'public, max-age=2592000')
    .expect('Etag', '"12783-O+uYHa1nljeTWqe1xiWgzTqMMDk"')
    .expect(304);
});

test('return a fallback font for invalid name', function () {
  return fetch('/fonts/Open%20Sans%20XXXX/256-511.pbf')
    .expect('Content-Type', 'application/x-protobuf')
    .expect('Content-Length', '45992')
    .expect(200);
});

test('combines fonts if needed', function () {
  return fetch('/fonts/Metropolis%20Black,Open%20Sans%20Bold/0-255.pbf')
    .expect('Content-Type', 'application/x-protobuf')
    .expect(200);
});
