/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * A collection of utility methods for native JavaScript numbers.
 */
core.Module("core.Number",
{
	/**
	 * {String} Pads the @number {Number} to reach the given @length {Integer}.
	 */
	pad : function(number, length) 
	{
		if (jasy.Env.isSet("debug")) 
		{
			core.Assert.isType(number, "Number");
			core.Assert.isType(length, "Integer");
		}

		return (core.String.repeat("0", length) + number).slice(-length);
	},


	/**
	 * Executes the given @func {Function} @number {Number} of times.
	 * Support an optional @context {Object?} for execution.
	 */
	times : function(func, context, number) 
	{
		if (jasy.Env.isSet("debug")) 
		{
			core.Assert.isType(func, "Function");

			if (context != null) {
				core.Assert.isType(context, "Object");	
			}
			
			core.Assert.isType(number, "Number");
		}

		for (var i=0; i<number; i++) {
			context ? func.call(context) : func();
		}
	},


	/**
	 * {String} Converts the @number {Number} to a hex string.
	 */
	toHex : function(number) 
	{
		if (jasy.Env.isSet("debug")) {
			core.Assert.isType(number, "Number");
		}

		return number.toString(16);
	},


	/** 
	 * {Integer} Converts the @number {Number} to integer 
	 */
	toInteger : function(number) 
	{
		if (jasy.Env.isSet("debug")) {
			core.Assert.isType(number, "Number");
		}

    return number < 0 ? Math.ceil(number) : Math.floor(number);
  }	
});
