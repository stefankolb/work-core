/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Just a dump placeholder for environments without "console" object.
 *
 * Emulates just the basic logging methods with an empty function. Maps missing functions
 * to `console.log` automatically.
 *
 * If inside of web worker redirects console logging output to a message to main thread. 
 * The message itself is an object containing both fields type="core/debug/(method)" and
 * msg=[..], e.g. { type: "core/debug/warn", msg: ["my warning"] }
 */
(function(global, slice)
{
	var methods = "log,debug,error,warn,info,timeStamp".split(",");
	var console = global.console || (global.console = {});
	
	if (jasy.Env.isSet("runtime", "worker")) {
		var workerConsoleGenerator = function(method) {
			return function() {
				self.postMessage({
					type: "core/debug/" + method,
					msg: Array.protottype.slice.call(arguments, 0)
				});
			};
		};

		for (var i=0, l=methods.length; i<l; i++) {
			var method = methods[i];
			console[method] = workerConsoleGenerator(method);
		}
	} else {
		var log = console.log || new Function;

		for (var i=0, l=methods.length; i<l; i++)
		{
			var name = methods[i];
			if (!console[name]) {
				console[name] = log;
			}
		}
	}
	
	if (!console.assert) 
	{
		console.assert = function(expression) 
		{
			if (!expression) {
				throw new Error(slice.call(arguments, 1).join(" "));
			}
		}
	}
})(core.Main.getGlobal(), Array.prototype.slice);
