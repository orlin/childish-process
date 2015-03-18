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

var invoke = function (opts) {
  // NOTE: the strategy comes from the templates (probably) or options (both)
  var o = template(opts)
  if (typeof o.strategy === "function") {
    return o.strategy(o)
  }
  else {
    return (strategies[o.strategy] || strategies.exiter)(o)
  }
}

module.exports = function (options) {
  if (typeof options === "object") {
    // NOTE: intentional mutations of templates and strategies
    if (options.templates) merge(templates, options.templates)
    if (options.strategies) merge(strategies, options.strategies)
    if (options.template) {
      // being given options.template - means we'd like to run it
      // maybe rename to invoke, or something more intuitive?
      return invoke(templates[options.template] || templates.default)
    }
    else {
      // perhaps because we'd like to see what the options would become,
      // given a template's options?
      return template(options)
    }
  }
  else return {}
}
