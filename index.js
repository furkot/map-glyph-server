require('dotenv').config({ path: '/etc/default/map-glyph-server' });

const connect = require('connect');
const router = require('./lib/map-glyph-server');

const PORT = process.env.MAP_GLYPH_SERVER_PORT || 3060;
const FONT_PATH = process.env.MAP_GLYPH_SERVER_FONT_PATH;

if (!FONT_PATH) {
  console.error('Please configure MAP_GLYPH_SERVER_FONT_PATH');
  process.exit(1);
}

const app = connect();

app.use(router(FONT_PATH));


module.exports = app;

if (!module.parent) {
  app.listen(PORT);
  console.log('Listening on port', PORT);
}
