/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * This class comes with all relevant information regarding
 * the client's platform.
 *
 * The listed constants are automatically filled on the initialization
 * phase of the class. The defaults listed in the API viewer need not
 * to be identical to the values at runtime.
 */
core.Module("core.detect.Platform", 
{
	VALUE: jasy.Env.isSet("runtime", "browser") ? (function() 
	{
		var input = navigator.platform || navigator.userAgent;
		var name;

		if (/Windows|Win32|Win64/.exec(input)) {
			name = "win";
		} else if (/Macintosh|MacPPC|MacIntel|Mac OS|iPad|iPhone|iPod/.exec(input)) {
			name = "mac";
		} else if (/X11|Linux|BSD|Sun OS|Maemo|Android|webOS/.exec(input)) {
			name = "unix";
		}

		/** 
		 * {=String} One of `win`, `mac` or `unix`
		 */
		return name;
	})() : "server"
});

