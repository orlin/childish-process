var exe, exec, handlers, merge, ref, run, spawn,
  slice = [].slice;

require("source-map-support").install();

ref = require("child_process"), exec = ref.exec, spawn = ref.spawn;

merge = require("lodash.merge");

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

handlers = function(opts) {
  var defaults;
  defaults = {
    stdout: function(data) {
      return process.stdout.write(data);
    },
    stderr: function(data) {
      return process.stderr.write(data);
    },
    error: function(err, context) {
      return console.trace(JSON.stringify(err, null, 2));
    },
    close: function(code, context) {
      if (code !== 0) {
        return console.log("This `" + context.cmd + "` process exited with " + code + ".");
      }
    }
  };
  if (opts != null) {
    return merge(defaults, opts);
  } else {
    return defaults;
  }
};

run = function(cmd, opts) {
  var args, chips, command, context, handles;
  if (opts == null) {
    opts = {};
  }
  args = cmd.split(/\s+/);
  command = args.shift();
  handles = handlers(opts.childish);
  context = {
    "cmd": cmd
  };
  chips = spawn(command, args, opts);
  chips.stdout.on("data", function(data) {
    return handles.stdout(data);
  });
  chips.stderr.on("data", function(data) {
    return handles.stderr(data);
  });
  chips.on("error", function(err) {
    return handles.error(err, context);
  });
  return chips.on("close", function(code) {
    return handles.close(code, context);
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