var notify = require('./notify.js')

module.exports = {

  "exiter": function (opts) {
    // the default strategy
    return {
      "close": function(code) {
        if (opts.verbose) {
          console.log('exiter.on("close") called with:\n' + opts)
        }
        if (code === 0) {
          if (opts.success) notify(opts.success)
        }
        else {
          if (opts.failure) notify(opts.failure)
        }
      }
    }
  },

  "stdoer": function (opts) {
    var recipe = {}
    if (opts.success) {
      recipe.stdout = function(data) {
        notify(opts.success)
      }
    }
    if (opts.failure) {
      recipe.stderr = function(data) {
        notify(opts.failure)
      }
    }
    return recipe
  }

}
