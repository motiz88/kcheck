#!/usr/bin/env node

var child = require("child_process");
var chalk = require("chalk");
var path  = require("path");
var fs    = require("fs");

var cmds = [
  {
    name: path.join(__dirname, "node_modules", ".bin", "eslint"),
    args: ["--config", "eslint-config-kittens", "."]
  }
];

if (fs.existsSync(".flowconfig")) {
  cmds.push({
    name: require("flow-bin"),
    args: ["check"]
  });
}

var err = false;
var remaining = cmds.length;
next();

function next() {
  if (!cmds.length) return;

  var cmd = cmds.shift();
  var proc = child.spawn(cmd.name, cmd.args, { stdio: "inherit" });

  proc.on("error", function () {
    err = true;
  });

  proc.on("close", function (code) {
    if (code != 0) {
      err = true;
    }

    if (--remaining) {
      next();
    } else {
      done();
    }
  });
}

function done() {
  if (err) {
    process.exit(1);
  } else {
    console.log(chalk.green("All good! ✨"));
    process.exit();
  }
}
