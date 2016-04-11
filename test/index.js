var path = require('path');
var assert = require('assert');
var assertDir = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var rollup = require('../lib/');

describe('metalsmith-rollup', function () {
  it('should roll up basic', function (done) {
    (new Metalsmith('test/fixtures/basic')).
      use(rollup({
        entry: path.resolve(__dirname, 'fixtures/basic/src/main.js'),
        format: 'iife',
        dest: 'bundle.js'
      })).
      build(function (err, files) {
        if (err) {
          return done(err);
        }
        assert.equal(Object.keys(files).length, 4);
        assertDir('test/fixtures/basic/expected', 'test/fixtures/basic/build');
        return done(null);
      });
  });

  it('should roll up with source map', function (done) {
    (new Metalsmith('test/fixtures/sourcemap')).
      use(rollup({
        entry: path.resolve(__dirname, 'fixtures/sourcemap/src/main.js'),
        format: 'iife',
        dest: 'bundle.js',
        sourceMap: true
      }, {
        ignoreSources: true
      })).
      build(function (err, files) {
        if (err) {
          return done(err);
        }
        assert.equal(Object.keys(files).length, 3);
        assertDir('test/fixtures/sourcemap/expected', 'test/fixtures/sourcemap/build');
        return done(null);
      });
  });

  it('should report errors', function (done) {
    (new Metalsmith('test/fixtures/basic')).
      use(rollup({
        entry: path.resolve(__dirname, 'fixtures/faulty/src/main.js'),
        format: 'iife',
        dest: 'bundle.js'
      })).
      build(function (err) {
        if (err) {
          assert.equal(err.message.match(/Could not resolve \.\/mathz/).length, 1);
          return done(null);
        }
        throw new Error('Error excepted, none occurred!');
      });
  });
});
