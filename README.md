# metalsmith-rollup

[![Build status](https://travis-ci.org/attila/metalsmith-rollup.svg)](https://travis-ci.org/attila/metalsmith-rollup)

A [Rollup](http://rollupjs.org) plugin for [Metalsmith](http://www.metalsmith.io/).

## Installation

```
npm install --save-dev metalsmith-rollup
```

## Usage

Currently only the JavaScript API is supported. CLI Usage via `metalsmith.json` is in the works.

In your build file:

```js
var rollup = require('metalsmith-rollup');

  metalsmith.use(rollup({
    entry: 'src/js/main.js', // Entry point
    dest: 'js/bundle.js', // This will be placed under "build/"
  })).

```

## Roadmap

Planned features

 * Support for CLI usage via rollup.config.js
 * Support for source maps
 * Test coverage

## License

Copyright 2016 [Attila Beregszaszi](http://attilab.com/), MIT licensed, see LICENSE for details.
