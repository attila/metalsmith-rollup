const path = require('path')
const rollup = require('rollup')

function normalizePath (p) {
  return p.split(path.sep).filter(function filter (q) {
    return typeof q === 'string' && q.length > 0
  }).join('/')
}

function getMetalsmithKey (files, p) {
  let key
  p = normalizePath(p)
  for (key in files) {
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
  return function pluginOutput (files, metalsmith, done) {
    if (config.input && typeof config.input === 'string') {
      if (!config.plugins) config.plugins = []
      for (const file of Object.keys(files)) {
        if (path.resolve(metalsmith.source(), file) === path.resolve(config.input)) {
          config.plugins.unshift(passthru(path.resolve(config.input), files[file].contents.toString()))
        }
      }
    }
    rollup.rollup(config)
      .then(function generate (bundle) {
        return bundle.generate(config)
      })
      .then(function finalize (output) {
        const key = getMetalsmithKey(files, config.output.file) || config.output.file
        let sourceMapKey
        files[key] = {
          contents: output.code
        }
        if (config.output && config.output.sourcemap && output.map && output.map.file) {
          sourceMapKey = getMetalsmithKey(files, output.map.file + '.map') ||
            output.map.file + '.map'
          files[sourceMapKey] = {
            contents: output.map
          }
        }
        if (pluginConfig && pluginConfig.ignoreSources && output.map && output.map.sources) {
          output.map.sources
            .map(function getKey (file) {
              return getMetalsmithKey(files, file) || path.basename(file)
            })
            .forEach(function eachFile (file) {
              delete files[file]
            })
        }
        return done()
      })
      .catch(function reject (err) {
        done(err)
      })
  }
}
