const Debug = require('debug')
const { sep, resolve, basename } = require('path')
const rollup = require('rollup')

const debug = Debug('metalsmith-rollup')

function normalizePath (p) {
  return p.split(sep).filter((q) => {
    return typeof q === 'string' && q.length > 0
  }).join('/')
}

function getMetalsmithKey (files, p) {
  p = normalizePath(p)

  for (const key in files) {
    if (files.hasOwnProperty(key) && normalizePath(key) === p) {
      return key
    }
  }
  return null
}

function passthru (name, contents) {
  return {
    load (id) {
      if (id === name) return contents
    }
  }
}

module.exports = function plugin (config, pluginConfig) {
  const outFile = config.output.file

  return function (files, metalsmith, done) {
    if (config.input && typeof config.input === 'string') {
      const inputPath = resolve(config.input)

      if (!config.plugins) config.plugins = []
      for (const file of Object.keys(files)) {
        if (resolve(metalsmith.source(), file) === inputPath) {
          const contents = files[file].contents.toString()
          config.plugins.unshift(passthru(inputPath, contents))
        }
      }
    }

    return rollup.rollup(config)
      .then((bundle) => {
        return bundle.generate(config)
      })
      .then((result) => {
        // should really loop through outputs like in
        // https://rollupjs.org/guide/en#rollup-rollup
        const output = result.output[0]
        const mapFile = output.map ? output.map.file : ''
        const key = getMetalsmithKey(files, outFile) || outFile

        files[key] = {contents: output.code}

        if (config.output.sourcemap && mapFile) {
          const mapFileName = `${mapFile}.map`
          const sourceMapKey = getMetalsmithKey(files, mapFileName) || mapFileName
          files[sourceMapKey] = {contents: output.map}
        }

        if (pluginConfig && pluginConfig.ignoreSources && output.map.sources) {
          output.map.sources
            .map(function getKey (file) {
              return getMetalsmithKey(files, file) || basename(file)
            })
            .forEach(function eachFile (file) {
              delete files[file]
            })
        }
        debug(`Successfully bundled file ${outFile}!`)
        return done()
      })
      .catch((err) => {
        done(err)
      })
  }
}
