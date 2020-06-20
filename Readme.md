[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][deps-image]][deps-url]
[![Dev Dependency Status][deps-dev-image]][deps-dev-url]

# map-glyph-server

Server for glyph/font files compatible with mapbox-gl-js

## Install

```sh
$ npm install --global map-glyph-server
```

## Usage

Prior to starting the server glyphs should be located in `MAP_GLYPH_SERVER_FONT_PATH` directory. This can
be achieved using [openmaptiles/fonts] or a similar utility.

`MAP_GLYPH_SERVER_PORT` is the port number map-glyph-server will use

`/etc/default/map-glyph-server` can be used to set environment variables

In order to use the fonts edit Style JSON and change the endpoint for glyphs:

    "glyphs": "https://fonts.example.com/fonts/{fontstack}/{range}.pbf",

## License

MIT © [Damian Krzeminski](https://furkot.com)

[npm-image]: https://img.shields.io/npm/v/map-glyph-server.svg
[npm-url]: https://npmjs.org/package/map-glyph-server

[travis-url]: https://travis-ci.org/furkot/map-glyph-server
[travis-image]: https://img.shields.io/travis/furkot/map-glyph-server.svg

[deps-image]: https://img.shields.io/david/furkot/map-glyph-server.svg
[deps-url]: https://david-dm.org/furkot/map-glyph-server

[deps-dev-image]: https://img.shields.io/david/dev/furkot/map-glyph-server.svg
[deps-dev-url]: https://david-dm.org/furkot/map-glyph-server?type=dev

[openmaptiles/fonts]: https://github.com/openmaptiles/fonts
