/* eslint-env mocha */
const path = require('path')
const assert = require('assert')
const assertDir = require('assert-dir-equal')
const Metalsmith = require('metalsmith')
const rollup = require('../lib/')

describe('metalsmith-rollup', () => {
  it('rolls up basic', done => {
    (new Metalsmith('test/fixtures/basic'))
      .use(rollup({
        entry: path.resolve(__dirname, 'fixtures/basic/src/main.js'),
        format: 'iife',
        dest: 'bundle.js'
      }))
      .build(function (err, files) {
        if (err) {
          return done(err)
        }
        assert.equal(Object.keys(files).length, 4)
        assertDir('test/fixtures/basic/expected', 'test/fixtures/basic/build')
        done()
      })
  })

  it('rolls up with source map', done => {
    (new Metalsmith('test/fixtures/sourcemap'))
      .use(rollup({
        entry: path.resolve(__dirname, 'fixtures/sourcemap/src/main.js'),
        format: 'iife',
        dest: 'bundle.js',
        sourceMap: true
      }, {
        ignoreSources: true
      }))
      .build(function (err, files) {
        if (err) {
          return done(err)
        }
        assert.equal(Object.keys(files).length, 3)
        assertDir('test/fixtures/sourcemap/expected', 'test/fixtures/sourcemap/build')
        done()
      })
  })

  it('reports errors', done => {
    (new Metalsmith('test/fixtures/basic'))
      .use(rollup({
        entry: path.resolve(__dirname, 'fixtures/faulty/src/main.js'),
        format: 'iife',
        dest: 'bundle.js'
      }))
      .build(function (err) {
        if (err) {
          assert.equal(err.message.match(/Could not resolve \.\/mathz/).length, 1)
          done()
        }
        throw new Error('Error excepted, none occurred!')
      })
  })
})
