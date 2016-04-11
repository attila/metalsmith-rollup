var path = require('path');
var rollup = require('rollup');

function normalizePath(p) {
  return p.split(path.sep).filter(function filter(q) {
    return typeof q === 'string' && q.length > 0;
  }).join('/');
}

function getMetalsmithKey(files, p) {
  var key;
  p = normalizePath(p);
  for (key in files) {
    if (files.hasOwnProperty(key) && normalizePath(key) === p) {
      return key;
    }
  }
  return null;
}

module.exports = function plugin(config, pluginConfig) {
  return function pluginOutput(files, metalsmith, done) {
    rollup.rollup(config).
      then(function generate(bundle) {
        return bundle.generate(config);
      }).
      then(function finalize(output) {
        var key = getMetalsmithKey(files, config.dest) || config.dest;
        var sourceMapKey;
        files[key] = {
          contents: output.code
        };
        if (config.sourceMap && output.map && output.map.file) {
          sourceMapKey = getMetalsmithKey(files, output.map.file + '.map') ||
            output.map.file + '.map';
          files[sourceMapKey] = {
            contents: output.map
          };
        }
        if (pluginConfig && pluginConfig.ignoreSources && output.map && output.map.sources) {
          output.map.sources.
            map(function getKey(file) {
              return getMetalsmithKey(files, file) || path.basename(file);
            }).
            forEach(function eachFile(file) {
              delete files[file];
            });
        }
        return done();
      }).
      catch(function reject(err) {
        done(err);
      });
  };
};
