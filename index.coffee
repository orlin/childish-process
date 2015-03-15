require("source-map-support").install()

{exec, spawn} = require("child_process")
merge = require("lodash.merge")

# exec #simple
exe = (cmd, opts, cb) ->
  exec cmd, opts, (err, stdout, stderr) ->
    process.stderr.write(stderr) if stderr
    if err isnt null
      console.trace JSON.stringify(err, null, 2)
    else if cb?
      cb(stdout)
    else
      process.stdout.write(stdout)

# event-handler defaults / overrides
handlers = (opts) ->
  defaults =
    stdout: (data) -> process.stdout.write(data)
    stderr: (data) -> process.stderr.write(data)
    error: (err, context) -> console.trace JSON.stringify(err, null, 2)
    close: (code, context) ->
      unless code is 0
        console.log "This `#{context.cmd}` process exited with #{code}."
  if opts?
    merge defaults, opts
  else
    defaults

# spawn #simple
run = (cmd, opts = {}) ->
  args = cmd.split /\s+/
  command = args.shift()
  handles = handlers(opts.childish)
  context = "cmd": cmd
  chips = spawn(command, args, opts)
  chips.stdout.on "data", (data) -> handles.stdout(data)
  chips.stderr.on "data", (data) -> handles.stderr(data)
  chips.on "error", (err) -> handles.error(err, context)
  chips.on "close", (code) -> handles.close(code, context)

module.exports = (cmd, args...) ->
  n = args.length
  if n > 0
    if typeof args[n - 1] is "function"
      if n is 1
        exe cmd, {}, args[0]
      else
        # exe takes at most 3 arguments (here using the first & last of args)
        exe cmd, args[0], args[n - 1]
    else
      # run takes at most 2 arguments
      run cmd, args[0]
  else
    run cmd
