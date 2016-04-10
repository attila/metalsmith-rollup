var path = require('path');
var assert = require('assert');
var assertDir = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var rollup = require('../lib/');

describe('metalsmith-rollup', function () {
  it('should roll up basic', function (done) {
    (new Metalsmith('test/fixtures/basic')).
      ignore(path.resolve(__dirname, 'fixtures/basic/src/**.js')).
      use(rollup({
        entry: path.resolve(__dirname, 'fixtures/basic/src/main.js'),
        format: 'iife',
        dest: 'bundle.js'
      })).
      build(function (err, files) {
        if (err) {
          return done(err);
        }
        assert.equal(Object.keys(files).length, 2);
        assertDir('test/fixtures/basic/expected', 'test/fixtures/basic/build');
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
