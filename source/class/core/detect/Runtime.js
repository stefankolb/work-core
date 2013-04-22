/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function() 
{
	var global = core.Main.getGlobal();
	
	/**
	 * Holds basic informations about the environment the script is running in.
	 */
	core.Module("core.detect.Runtime", {
		VALUE :	core.Main.isHostType(global, 'navigator') ? (core.Main.isHostType(global, 'document') ? "browser" : "worker") : "native"
	});

})();
