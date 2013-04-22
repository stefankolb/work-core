/* 
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/** Adds the pretty essential `Array.isArray()` method from ES5 if it is missing. */
core.Main.addStatics("Array",
{
	/**
	 * Implements ES5 `isArray` method to verify whether @value {var} is an `Array`.
	 * See also: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
	 */
	isArray : function(value) {
    return core.Main.isTypeOf(value, "Array");
	}
});
