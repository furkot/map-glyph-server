[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][deps-image]][deps-url]
[![Dev Dependency Status][deps-dev-image]][deps-dev-url]

# map-glyph-server

Server for glyph/font files compatible with [mapbox-gl-js]

## Install

```sh
$ npm install --global map-glyph-server
```

## Environment

The following environment variables are used by `map-glyph-server`

- `MAP_GLYPH_SERVER_FONT_PATH` - needs to specify the location of the fonts files
- `MAP_GLYPH_SERVER_PORT` - local port to which `map-glyph-server` binds to default: *3060*
- `MAP_GLYPH_SERVER_CACHE_MAX_AGE` - if specified used as a `max-age` value of the
  [`Cache-Control` header][cache-control] when serving font/pbf files
  (maximum amount of seconds a resource is considered fresh)

`/etc/default/map-glyph-server` can be used to set environment variables

## Usage

Prior to starting the server glyphs should be located in `MAP_GLYPH_SERVER_FONT_PATH` directory. This can
be achieved using [openmaptiles/fonts] or a similar utility.

In order to use the fonts edit [Style JSON][glyphs-doc] and change the endpoint for glyphs:

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
[cache-control]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
[glyphs-doc]: https://docs.mapbox.com/mapbox-gl-js/style-spec/glyphs/
[mapbox-gl-js]: https://docs.mapbox.com/mapbox-gl-js/api/
