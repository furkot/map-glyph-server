const Router = require('@pirxpilot/router');

const findFonts = require('./find-fonts');
const getFontsPbf = require('./get-fonts-pbf');

const CACHE_MAX_AGE = process.env.MAP_GLYPH_SERVER_CACHE_MAX_AGE;

function find(req, res, next) {
  const { fontPath } = req;

  findFonts(fontPath)
    .then(fonts => {
      req.fonts = fonts;
      req.fontList = Object.keys(fonts);
      next();
    })
    .catch(next);
}

function sendFontsList(req, res) {
  const fontList = req.fontList.sort();
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(fontList));
}

function sendFontsPbf(req, res) {
  const { fontPath } = req;
  let { fontstack, range } = req.params;

  fontstack = decodeURI(fontstack).split(',');

  getFontsPbf(fontPath, fontstack, range, req.fontList)
    .then(pbf => {
      if (pbf.length === 0) {
        res.sendStatus(204);
      } else {
        res.setHeader('Content-Type', 'application/x-protobuf');
        res.end(pbf);
      }
    })
    .catch(err => {
      const status = typeof err === 'number' ? err : 500;
      return res.sendStatus(status);
    });
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
    /^\/fonts\/(?<fontstack>[^/]+)\/(?<range>\d+-\d+)\.pbf$/,
    find,
    headers,
    sendFontsPbf
  );
  router.get('/fonts.json', find, sendFontsList);
  return router;
};
