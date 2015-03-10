var exec, spawn, _ref;

_ref = require("child_process"), exec = _ref.exec, spawn = _ref.spawn;

module.exports = {
  exe: function(cmd, cb) {
    return exec(cmd, function(err, stdout, stderr) {
      if (stderr) {
        process.stderr.write(stderr);
      }
      if (err !== null) {
        return console.trace(JSON.stringify(err, null, 2));
      } else if (cb != null) {
        return cb(stdout);
      } else {
        return process.stdout.write(stdout);
      }
    });
  },
  run: function(cmd, opts) {
    var args, chips, command, handlers;
    if (opts == null) {
      opts = {};
    }
    args = cmd.split(/\s+/);
    command = args.shift();
    handlers = opts.eventHandlers;
    chips = spawn(command, args, opts);
    chips.stdout.on("data", function(data) {
      if (typeof (handlers != null ? handlers.stdout : void 0) === "function") {
        return handlers.stdout(data);
      } else {
        return process.stdout.write(data);
      }
    });
    chips.stderr.on("data", function(data) {
      if (typeof (handlers != null ? handlers.stderr : void 0) === "function") {
        return handlers.stderr(data);
      } else {
        return process.stderr.write(data);
      }
    });
    chips.on("error", function(err) {
      if (typeof (handlers != null ? handlers.error : void 0) === "function") {
        return handlers.error(err);
      } else {
        return console.trace(JSON.stringify(err, null, 2));
      }
    });
    return chips.on("close", function(code) {
      if (typeof (handlers != null ? handlers.close : void 0) === "function") {
        return handlers.close(code);
      } else {
        if (code !== 0) {
          return console.log("This `" + cmd + "` process exited with code " + code + ".");
        }
      }
    });
  }
};
