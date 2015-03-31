var path = require("path")

var failure = function () {
  return {
    "title": "#FAIL",
    "message": "The command has failed!",
    "icon": path.join(__dirname, "icons", "fail-details.png"),
    sound: true
  }
}

var success = function () {
  return {
    "title": "#OK",
    "message": "It's all good.",
    "icon": path.join(__dirname, "icons", "ok-sticker.jpg")
  }
}

module.exports = {
  "default": {
    "strategy": "exiter",
    "extends": false,
    "verbose": false,
    "failure": failure()
  },
  "notify": {
    "strategy": "exiter",
    "extends": false,
    "verbose": false,
    "success": success(),
    "failure": failure()
  }
}
