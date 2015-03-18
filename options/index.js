var merge = require('lodash.merge')
var templates = require('./templates.json')
var strategies = require('./strategies.js')

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
