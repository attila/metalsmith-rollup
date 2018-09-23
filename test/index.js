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
        input: path.resolve(__dirname, 'fixtures/basic/src/main.js'),
        output: {
          format: 'iife',
          file: 'bundle.js'
        }
      }))
      .build((err, files) => {
        if (err) throw err
        assert.equal(Object.keys(files).length, 4)
        assertDir('test/fixtures/basic/expected', 'test/fixtures/basic/build')
        done()
      })
  })

  it('uses the metalsmith content pipeline', done => {
    (new Metalsmith('test/fixtures/pipeline'))
      .use((files, metalsmith, done) => {
        files['main.js'].contents = (
          "console.log('Hello')\n" +
          files['main.js'].contents.toString()
        )
        done()
      })
      .use(rollup({
        input: path.resolve(__dirname, 'fixtures/pipeline/src/main.js'),
        output: {
          format: 'iife',
          file: 'bundle.js'
        }
      }))
      .build((err, files) => {
        if (err) throw err
        assert.equal(Object.keys(files).length, 2)
        assertDir('test/fixtures/pipeline/expected', 'test/fixtures/pipeline/build')
        done()
      })
  })

  it('rolls up with source map', done => {
    (new Metalsmith('test/fixtures/sourcemap'))
      .use(rollup({
        input: path.resolve(__dirname, 'fixtures/sourcemap/src/main.js'),
        output: {
          format: 'iife',
          file: 'bundle.js',
          sourcemap: true
        }
      }, {
        ignoreSources: true
      }))
      .build((err, files) => {
        if (err) throw err
        assert.equal(Object.keys(files).length, 3)
        assertDir('test/fixtures/sourcemap/expected', 'test/fixtures/sourcemap/build')
        done()
      })
  })

  it('reports errors', done => {
    (new Metalsmith('test/fixtures/basic'))
      .use(rollup({
        input: path.resolve(__dirname, 'fixtures/faulty/src/main.js'),
        output: {
          format: 'iife',
          file: 'bundle.js'
        }
      }))
      .build(err => {
        assert(err.message.includes("Could not resolve './mathz'"))
        done()
      })
  })
})
