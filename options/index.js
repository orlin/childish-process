var notifier = require('node-notifier')
var merge = require('lodash.merge')
var templates = require('./templates.json')

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
  if (typeof options === "object") {
    if (options.templates) {
      merge(templates, options.templates)
    }
    if (options.template) {
      return strategy(template(templates[options.template] || templates.default))
    }
    // TODO: when is this used?
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
