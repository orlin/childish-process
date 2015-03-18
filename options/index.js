var notifier = require('node-notifier')
var merge = require('lodash.merge')
var templates = require('./templates.json')

var notify = function (something) {
  notifier.notify(something, function (err, response) {
    // NOTE: response could be handled via options fn or custom strategy notify
    if (err) {
      console.error(err)
      notifier.notify({
        message: 'Notification failure, check the error log for details.'
      })
    }
  })
}

var template = function (o) {
  // notification templates
  switch (typeof o) {
    case "string":
      return templates[o] || templates.default
    case "object":
      if (templates[o.extends]) {
        if (templates[o.extends].extends) {
          return merge({}, templates[o.extends].extends, templates[o.extends], o)
        }
        else {
          return merge({}, templates[o.extends], o)
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
      // NOTE: intentional mutation here
      merge(templates, options.templates)
    }
    if (options.template) {
      return strategy(template(templates[options.template] || templates.default))
    }
    // TODO: when are these used?
    if (opts.mode === "notify") {
      return strategy(template(options))
    }
    else {
      return template(options)
    }
  }
  return {}
}
