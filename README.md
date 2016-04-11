# metalsmith-rollup

[![Build status](https://api.travis-ci.org/attila/metalsmith-rollup.svg?branch=master)](https://travis-ci.org/attila/metalsmith-rollup) [![codecov.io](https://codecov.io/github/attila/metalsmith-rollup/coverage.svg?branch=master)](https://codecov.io/github/attila/metalsmith-rollup?branch=master)

A [Rollup](http://rollupjs.org) plugin for [Metalsmith](http://www.metalsmith.io/).

## Installation

```
npm install --save-dev metalsmith-rollup
```

## Usage

Currently only the JavaScript API is supported. CLI Usage via `metalsmith.json` is in the works.

In your build file:

```js
var Metalsmith = require('metalsmith');
var rollup = require('metalsmith-rollup');

Metalsmith(__dirname).
  use(rollup({
    entry: 'src/js/main.js', // Entry point
    dest: 'js/bundle.js', // This will be placed under "build/"
  })).
  build();

```

Source map generation is supported. Processed source files can be ignored automatically by passing `ignoreSources` option to the plugin:

```js
Metalsmith(__dirname).
  use(rollup({
    entry: 'src/js/main.js',
    dest: 'js/bundle.js',
    sourceMap: true
  }, {
    ignoreSources: true
  })).
  build();

```

## Roadmap

Planned features

 * Support for CLI usage via rollup.config.js
 * ~~Support for source maps~~
 * ~~Test coverage~~

## License

Copyright 2016 [Attila Beregszaszi](http://attilab.com/), MIT licensed, see LICENSE for details.
