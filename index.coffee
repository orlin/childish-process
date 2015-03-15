require("source-map-support").install()

{exec, spawn} = require("child_process")

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

# spawn #simple
run = (cmd, opts = {}) ->
  args = cmd.split /\s+/
  command = args.shift()
  handlers = opts.eventHandlers
  chips = spawn(command, args, opts)
  chips.stdout.on "data", (data) ->
    if typeof handlers?.stdout is "function"
      handlers.stdout(data)
    else
      process.stdout.write(data)
  chips.stderr.on "data", (data) ->
    if typeof handlers?.stderr is "function"
      handlers.stderr(data)
    else
      process.stderr.write(data)
  chips.on "error", (err) ->
    if typeof handlers?.error is "function"
      handlers.error(err)
    else
      console.trace JSON.stringify(err, null, 2)
  chips.on "close", (code) ->
    if typeof handlers?.close is "function"
      handlers.close(code)
    else
      unless code is 0
        console.log "This `#{cmd}` process exited with code #{code}."


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
