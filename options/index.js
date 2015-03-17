var notifier = require('node-notifier')
var merge = require('lodash.merge')

var templates = {
  "default": {
    "mode": "notify",
    "strategy": "exiter",
    "extends": false,
    "verbose": false,
    "failure": {"message": "The command has failed!"}
  },
  "build-w": {
    "strategy": "stdoer",
    "extends": "default",
    "failure": {"message": "The build has failed!"}
  },
  "test": {
    "extends": "default",
    "success": {"message": "The tests have passed."},
    "failure": {"message": "Tests fail!"}
  },
  "test-part": {
    "extends": "default",
    "success": {"message": "The requested tests have passed."},
    "failure": {"message": "Some tests fail!"}
  }
}

var template = function (o) {
  // notification templates
  switch (typeof o) {
    case "string":
      return templates[o] || templates.default
    case "object":
      if (templates[o.extends]) {
        if (templates[o.extends].extends) {
          return merge(templates[o.extends].extends, templates[o.extends], o)
        }
        else {
          return merge(templates[o.extends], o)
        }
      }
  }
  return o
}

var strategies = {
  "exiter": function (opts) {
    // the default strategy
    return {
      "close": function(code) {
        if (opts.verbose) {
          console.log('exiter.on("close") opts: ', opts)
        }
        if (code === 0) {
          notifier.notify(opts.success)
        }
        else {
          notifier.notify(opts.failure)
        }
      }
    }
  },
  "stdoer": function (opts) {
    var recipe = {}
    if (opts.success) {
      recipe.stdout = function(data) {
        notifier.notify(opts.success)
      }
    }
    if (opts.failure) {
      recipe.stderr = function(data) {
        notifier.notify(opts.failure)
      }
    }
    return recipe
  }
}

var strategy = function (opts) {
  //var opts = template(o)
  if (typeof opts.strategy === "function") {
    return opts.strategy(opts)
  }
  else {
    return (strategies[opts.strategy] || strategies.exiter)(opts)
  }
}

module.exports = function (options) {
  // NOTE: the strategy comes from the templates (probably) or options (both)
  switch (typeof options) {
    case "string":
      // template name
      return strategy(template(templates[options] || templates.default))
    case "object":
      var opts = template(options)
      if (opts.mode === "notify") {
        return strategy(opts)
      }
      else {
        return opts
      }
  }
  return {}
}
