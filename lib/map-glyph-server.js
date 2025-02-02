const Router = require('@pirxpilot/router');

const findFonts = require('./find-fonts');
const getFontsPbf = require('./get-fonts-pbf');

const CACHE_MAX_AGE = process.env.MAP_GLYPH_SERVER_CACHE_MAX_AGE;

async function find(req, res, next) {
  const fonts = await findFonts(req.fontPath);
  req.fonts = fonts;
  req.fontList = Object.keys(fonts);
  next();
}

function sendFontsList(req, res) {
  const fontList = req.fontList.sort();
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(fontList));
}

async function sendFontsPbf(req, res) {
  const { fontPath } = req;
  const { fontstack, range } = req.params;

  const fontstacks = decodeURI(fontstack).split(',');

  const pbf = await getFontsPbf(fontPath, fontstacks, range, req.fontList);
  if (pbf.length === 0) {
    res.writeHeader(204).end();
  } else {
    res.setHeader('Content-Type', 'application/x-protobuf');
    res.end(pbf);
  }
}

function headers(req, res, next) {
  if (CACHE_MAX_AGE) {
    res.setHeader('Cache-Control', `public, max-age=${CACHE_MAX_AGE}`);
  }
  next();
}

module.exports = function (fontPath) {
  const router = new Router({
    strict: true,
    caseSensitive: true
  });

  router.use(function (req, res, next) {
    req.fontPath = fontPath;
    next();
  });

  router.get(
    /^\/(?<fontstack>[^/]+)\/(?<range>\d+-\d+)\.pbf$/,
    find,
    headers,
    sendFontsPbf
  );
  router.get('/.json', find, sendFontsList);
  return router;
};
