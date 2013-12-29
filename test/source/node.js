#!/usr/bin/env node

eval(require("fs").readFileSync("js/kernel.js", "utf-8"));
core.io.Script.load("js/test-" + jasy.Env.CHECKSUM + ".js");
