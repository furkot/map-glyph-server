const express = require('express');

const findFonts = require('./find-fonts');
const getFontsPbf = require('./get-fonts-pbf');

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
  return res.send(fontList);
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

    res.header('Content-type', 'application/x-protobuf');
    res.send(pbf);
  });
}

module.exports = function(fontPath) {
  const router = express.Router({
    strict: true,
    caseSensitive: true
  });

  router.use(function(req, res, next) {
    req.fontPath = fontPath;
    next();
  });

  router.get('/fonts/:fontstack/:range([\\d]+-[\\d]+).pbf', find, sendFontsPbf);
  router.get('/fonts.json', find, sendFontsList);
  return router;
};
