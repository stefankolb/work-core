/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Checks whether the ES5 extensions should be loaded to fix missing engine functions.
 */
core.Module("core.detect.ES5", 
{
	/**
	 * {=Boolean} Whether ES5 is supported
	 */
	VALUE : !!(Array.prototype.map && Date.prototype.toISOString)
});
