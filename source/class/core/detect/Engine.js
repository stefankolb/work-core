/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Detects the browser engine in which the script is executed. It respects full browser engines
 * only and does not differentiate between different script engines or versions (like V8 vs. Nitro)
 */
core.Module("core.detect.Engine",
{
	/** {=String} One of `presto`, `gecko`, `webkit`, `trident` */
	VALUE : (function(global, toString)
	{
		var engine;
		
		if (jasy.Env.isSet("runtime", "browser"))
		{
			var doc = global.document;
			var nav = global.navigator;

			// Priority based detection
			// Omit possibility to fake user agent string by using object based detection first

			if ('\v' == 'v') {
				engine = "trident"; // Old Internet Explorer
			} else if (global.opera && toString.call(global.opera) == "[object Opera]") {
				engine = "presto"; // Opera
			} else if (global.WebKitCSSMatrix && (core.Main.isNative(WebKitCSSMatrix) || toString.call(WebKitCSSMatrix) == "[object WebKitCSSMatrixConstructor]")) {
				engine = "webkit"; // Chrome, Safari, ...
			} else if (global.controllers && toString.call(controllers) == "[object XULControllers]") {
				engine = "gecko"; // Firefox, Camino, ...
			} else if (nav && typeof nav.cpuClass === "string") {
				engine = "trident"; // Internet Explorer
			}			
		}
 		else
 		{
			engine = "webkit"; // NodeJS
		}
		
		return engine;
	})(core.Main.getGlobal(), Object.prototype.toString)
});
