/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

/**
 * Adds useful non-standard extensions to the `Number.prototype` like {#pad}, {#times} and {#hex}.
 */
core.Main.addMembers("Number",
{
	/** 
	 * {Integer} Converts the number to integer 
	 */
	toInteger : function() {
    return this < 0 ? Math.ceil(this) : Math.floor(this);
  },


	/**
	 * {String} Pads the number to reach the given @length {Integer}.
	 */
	pad : function(length) {
		return (core.util.String.repeat("0", length) + this).slice(-length);
	},


	/**
	 * Executes the given @func {Function} x-times.
	 * Support an optional @context {Object?} for execution.
	 */
	times : function(func, context) {
		for (var i=0; i<this; i++) {
			context ? func.call(context) : func();
		}
	},


	/**
	 * {String} Converts the number to a hex string.
	 */
	hex : function() {
		return this.toString(16);
	}
});

