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
    chips = spawn(command, args, opts)
    chips.stdout.on "data", (data) ->
      process.stdout.write(data)
    chips.stderr.on "data", (data) ->
      process.stderr.write(data)
    chips.on "error", (err) ->
      console.trace JSON.stringify(err, null, 2)
    chips.on "close", (code) ->
      unless code is 0
        console.log "This `#{cmd}` process exited with code #{code}."
