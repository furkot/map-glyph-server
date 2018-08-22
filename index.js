const express = require('express');
const router = require('./lib/map-glyph-server');


const PORT = process.env.MAP_GLYPH_SERVER_PORT || 3060;
const FONT_PATH = process.env.MAP_GLYPH_SERVER_FONT_PATH;

if (!FONT_PATH) {
  console.error('Please configure MAP_GLYPH_SERVER_FONT_PATH');
  process.exit(1);
}

const app = express();

app.use(router(FONT_PATH));


module.exports = app;

if (!module.parent) {
  app.listen(PORT);
  console.log('Listening on port', PORT);
}
