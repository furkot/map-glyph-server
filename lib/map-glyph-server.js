const Router = require('router');

const findFonts = require('./find-fonts');
const getFontsPbf = require('./get-fonts-pbf');

const CACHE_MAX_AGE = process.env.MAP_GLYPH_SERVER_CACHE_MAX_AGE;

function find(req, res, next) {
  const { fontPath } = req;

  findFonts(fontPath, function(err, fonts) {
    if(err) { return next(err); }
    req.fonts = fonts;
    req.fontList = Object.keys(fonts);
    next();
  });
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

  getFontsPbf(fontPath, fontstack, range, req.fontList, function(err, pbf) {
    if (err) {
      let status = typeof err === 'number' ? err : 500;
      return res.sendStatus(status);
    }
    if (pbf.length === 0) {
      return res.sendStatus(204);
    }

    res.setHeader('Content-Type', 'application/x-protobuf');
    res.end(pbf);
  });
}

function headers(req, res, next) {
  if (CACHE_MAX_AGE) {
    res.setHeader('Cache-Control', `public, max-age=${CACHE_MAX_AGE}`);
  }
  next();
}

module.exports = function(fontPath) {
  const router = new Router({
    strict: true,
    caseSensitive: true
  });

  router.use(function(req, res, next) {
    req.fontPath = fontPath;
    next();
  });

  router.get('/fonts/:fontstack/:range([\\d]+-[\\d]+).pbf', find, headers, sendFontsPbf);
  router.get('/fonts.json', find, sendFontsList);
  return router;
};
