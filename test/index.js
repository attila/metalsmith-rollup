/* eslint-env mocha */
const path = require('path')
const assert = require('assert')
const assertDir = require('assert-dir-equal')
const Metalsmith = require('metalsmith')
const rollup = require('../lib/')

describe('metalsmith-rollup', () => {
  it('rolls up basic', () => {
    (new Metalsmith('test/fixtures/basic'))
      .use(rollup({
        entry: path.resolve(__dirname, 'fixtures/basic/src/main.js'),
        format: 'iife',
        dest: 'bundle.js'
      }))
      .build((err, files) => {
        if (err) throw err
        assert.equal(Object.keys(files).length, 4)
        assertDir('test/fixtures/basic/expected', 'test/fixtures/basic/build')
      })
  })

  it('rolls up with source map', () => {
    (new Metalsmith('test/fixtures/sourcemap'))
      .use(rollup({
        entry: path.resolve(__dirname, 'fixtures/sourcemap/src/main.js'),
        format: 'iife',
        dest: 'bundle.js',
        sourceMap: true
      }, {
        ignoreSources: true
      }))
      .build((err, files) => {
        if (err) throw err
        assert.equal(Object.keys(files).length, 3)
        assertDir('test/fixtures/sourcemap/expected', 'test/fixtures/sourcemap/build')
      })
  })

  it('reports errors', () => {
    (new Metalsmith('test/fixtures/basic'))
      .use(rollup({
        entry: path.resolve(__dirname, 'fixtures/faulty/src/main.js'),
        format: 'iife',
        dest: 'bundle.js'
      }))
      .build(err => {
        assert(err.message.includes('Could not resolve ./mathz'))
      })
  })
})
