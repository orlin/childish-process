{exec, spawn} = require("child_process")

module.exports =

  # exec #simple
  exe: (cmd, cb) ->
    exec cmd, (err, stdout, stderr) ->
      process.stderr.write(stderr) if stderr
      if err isnt null
        console.trace JSON.stringify(err, null, 2)
      else if cb?
        cb(stdout)
      else
        process.stdout.write(stdout)

  # spawn #simple
  run: (cmd, opts = {}) ->
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
