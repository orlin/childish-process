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
    var args, chips, command;
    if (opts == null) {
      opts = {};
    }
    args = cmd.split(/\s+/);
    command = args.shift();
    chips = spawn(command, args, opts);
    chips.stdout.on("data", function(data) {
      return process.stdout.write(data);
    });
    chips.stderr.on("data", function(data) {
      return process.stderr.write(data);
    });
    chips.on("error", function(err) {
      return console.trace(JSON.stringify(err, null, 2));
    });
    return chips.on("close", function(code) {
      if (code !== 0) {
        return console.log("This `" + cmd + "` process exited with code " + code + ".");
      }
    });
  }
};
