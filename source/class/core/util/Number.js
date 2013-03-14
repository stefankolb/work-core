/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

core.Module("core.util.Number",
{
	/** 
	 * {Integer} Converts the @number {Number} to integer 
	 */
	toInteger : function(number) {
    return number < 0 ? Math.ceil(number) : Math.floor(number);
  },


	/**
	 * {String} Pads the @number {Number} to reach the given @length {Integer}.
	 */
	pad : function(number, length) {
		return (core.util.String.repeat("0", length) + number).slice(-length);
	},


	/**
	 * Executes the given @func {Function} @number {Number} of times.
	 * Support an optional @context {Object?} for execution.
	 */
	times : function(number, func, context) {
		for (var i=0; i<number; i++) {
			context ? func.call(context) : func();
		}
	},


	/**
	 * {String} Converts the @number {Number} to a hex string.
	 */
	hex : function(number) {
		return number.toString(16);
	}
});
