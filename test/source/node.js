#!/usr/bin/env node

var fs = require("fs");

eval(fs.readFileSync("script/kernel.js", "utf-8"));

console.debug("Is Browser: " + jasy.Env.isSet("runtime", "browser"))

eval(fs.readFileSync("script/test-" + jasy.Env.CHECKSUM + ".js", "utf-8"));

console.debug(test.Main)