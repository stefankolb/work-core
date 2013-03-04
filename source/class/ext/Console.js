/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

/**
 * Just a dump placeholder for environments without "console" object.
 *
 * Emulates just the basic logging methods with an empty function. Maps missing functions
 * to `console.log` automatically.
 */
(function(global)
{
	var methods = "log,debug,error,warn,info".split(",");
	var console = global.console || (global.console = {});
	
	if (jasy.Env.isSet("runtime", "webworker")) {
		for (var i=0, l=methods.length; i<l; i++) {
			var method = methods[i];
			console[method] = function() {
				self.postMessage({
					type: "core/debug/" + this, 
					msg: Array.prototype.slice.call(arguments, 0) // Must convert to instance of array
				});
			}.bind(method);
		}
	}
	
	var log = console.log || new Function;

	for (var i=0, l=methods.length; i<l; i++)
	{
		var name = methods[i];
		if (!console[name]) {
			console[name] = log;
		}
	}
	
	if (!console.assert) 
	{
		console.assert = function(expression) 
		{
			if (!expression) {
				throw new Error(Array.prototype.slice.call(arguments, 1).join(" "));
			}
		}
	}
})(core.Main.getGlobal());
