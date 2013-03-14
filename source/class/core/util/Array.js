/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Inspired by Sugar.js, Copyright 2011 Andrew Plummer
==================================================================================================
*/

"use strict";

core.Module("core.util.Array", 
{
	/**
	 * {Array} Converts the given @args {arguments} into an array.
	 */
	fromArguments : function(args) 
	{
		// See also: http://jsperf.com/arrayifying-arguments/7
		return args.length === 1 ? [ args[0] ] : Array.apply(null, args);
	},


	/**
	 * Merges both arrays into an object where values of array array are used
	 * as keys and values of @values {Array} are used as values.
	 */
	zip : function(array, values) 
	{
		var result = {};
		for (var i=0, l=array.length; i<l; i++) {
			result[array[i]] = values[i];
		}

		return result;
	},
	
	
	/**
	 * {Number} Returns the maximum number in the array.
	 */
	max : function(array) {
		return Math.max.apply(Math, array);
	},
	

	/**
	 * {Number} Returns the minimum number in the array.
	 */
	min : function(array) {
		return Math.min.apply(Math, array);
	},


	/**
	 * {Number} Returns the sum of all values in the array.
	 */
	sum : function(array) 
	{
		var sum = 0;
		array.forEach(function(value) {
			sum += value;
		});
		
		return sum;
	},

	
	/**
	 * {var} Inserts and returns the given @value {var} at the given @position {Integer?-1}. 
	 * Supports negative position values, too. Appends to the end if no position is defined.
	 */
	insertAt : function(array, value, position) 
	{
		position == null ? array.push(value) : array.splice(position < 0 ? array.length+position : position, 0, value);
		return value;
	},
	
	
	/**
	 * {Boolean} Whether the array contains the given @value {var}.
	 */
	contains : function(array, value) {
		return array.indexOf(value) > -1;
	},
	
	
	/**
	 * {Array} Clones the whole array and returns it.
	 */
	clone : function(array) 
	{
		// Wrap method for security reaons, so params to concat are safely ignored.
		return array.concat();
	},
	
	
	/**
	 * {Array} Filters out sparse fields (including all null/undefined values if @nulls is `true`) and returns a new compacted array.
	 */
	compact : function(array, nulls) 
	{
		// Pretty cheap way to iterate over all relevant values and create a copy
		return array.filter(nulls ? function(value) { return value != null; } : function() { return true; });
	},
	
	
	/**
	 * {Array} Returns a flattened, one-dimensional copy of the array.
	 */
	flatten: function(array) 
	{
		var result = [];
		
		array.forEach(function(value) 
		{
			if (value instanceof Array) {
				result.push.apply(result, value.flatten());
			} else {
				result.push(value);
			}
		});
	
		return result;
	},
	

	/**
	 * Randomizes the array via Fisher-Yates algorithm.
	 */
	randomize : function(array) {
		for(var j, x, self=array, i=self.length; i; j = parseInt(Math.random() * i), x = self[--i], self[i] = self[j], self[j] = x);
	},
	
	
	/** 
	 * {var} Removes the given @value {var} (first occourence only) from the array and returns it.
	 */
	remove : function(array, value) 
	{
		var position = array.indexOf(value);
		if (position != -1) 
		{
			array.splice(position, 1);
			return value;
		}
	},
	
	
	/**
	 * {Array} Returns a new array with all elements that are unique. 
	 * 
	 * Comparison happens based on the toString() value! So numbers
	 * and booleans might be unified with strings with the same "value".
	 * This is mainly because of performance reasons.
	 */
	unique : function(array) 
	{
		var strings = {};
		return array.filter(function(value) 
		{
			if (!strings.hasOwnProperty(value)) {
				return strings[value] = true;
			}
		});
	},
	
	
	/**
	 * {var} Returns the value at the given @position {Integer}. Supports negative indexes, too.
	 */
	at : function(array, position) {
		return array[position < 0 ? array.length + position : position];
	},
	
	
	/**
	 * {var} Returns the last item in the array.
	 */
	last: function(array) {
		return array[array.length-1];
	},
	

	/** 
	 * {var} Removes and returns the value at the given @position {Integer}.
	 */
	removeAt : function(array, position) 
	{
		var ret = array.splice(position < 0 ? array.length + position : position, 1);
		if (ret.length) {
			return ret[0];
		}
	},


	/**
	 * Removes a specific range (@from {Integer} <-> @to {Integer}) from the array. Supports negative indexes, too.
	 */
	removeRange : function(array, from, to) 
	{
		// Based on Array Remove - By John Resig (MIT Licensed)
		// http://ejohn.org/blog/javascript-array-remove/
		
		var rest = array.slice((to || from) + 1 || array.length);
		array.length = from < 0 ? array.length + from : from;
		array.push.apply(array, rest);
	}
});

