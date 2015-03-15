# childish-process -- child_process for grown-ups

A simpler way to call spawn or exec of `child_process`.
Makes it easy to call spawn with custom event-handlers.

## Use

```javascript
var run = require('childish-process');
```

- `run(command[, options]);` calls `child_process.spawn`
- `run(command[, options], callback);` calls `child_process.exec`

The options may include a "childish" key with custom event handlers for any of:
`"stdout"`, `"stderr"`, `"error"`, or `"close"`.
It's unlikely that node will ever add a childish option to its `child_process`.

## Unlicensed

This is free and unencumbered public domain software.
For more information, see [UNLICENSE](http://unlicense.org).
