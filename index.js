var exe, exec, ref, run, spawn,
  slice = [].slice;

require("source-map-support").install();

ref = require("child_process"), exec = ref.exec, spawn = ref.spawn;

exe = function(cmd, opts, cb) {
  return exec(cmd, opts, function(err, stdout, stderr) {
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
};

run = function(cmd, opts) {
  var args, chips, command, handlers;
  if (opts == null) {
    opts = {};
  }
  args = cmd.split(/\s+/);
  command = args.shift();
  handlers = opts.childish;
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
};

module.exports = function() {
  var args, cmd, n;
  cmd = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  n = args.length;
  if (n > 0) {
    if (typeof args[n - 1] === "function") {
      if (n === 1) {
        return exe(cmd, {}, args[0]);
      } else {
        return exe(cmd, args[0], args[n - 1]);
      }
    } else {
      return run(cmd, args[0]);
    }
  } else {
    return run(cmd);
  }
};

//# sourceMappingURL=index.js.map