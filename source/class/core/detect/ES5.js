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
 *
 * - Array.prototype.forEach
 * - Array.prototype.map
 * - Array.prototype.filter
 * - Array.prototype.every
 * - Array.prototype.some
 * - Array.prototype.reduce
 * - Array.prototype.reduceRight
 * - Date.prototype.toISOString
 * - Date.prototype.toJSON
 * - JSON.parse
 * - JSON.stringify
 *
 * Note: We figured that there are some features which are so essential that 
 * they have been fixed directly when the {fix} package is being loaded by {core.Main}.
 */
core.Module("core.detect.ES5", 
{
	/**
	 * {=Boolean} Whether ES5 is supported
	 */
	VALUE : !!(Array.prototype.map && Date.prototype.toISOString && this.JSON)
});


