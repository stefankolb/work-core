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

core.Module("core.Array", 
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
	 * Merges both given arrays into an object where values of @array {Array} are used
	 * as keys and values of @values {Array} are used as values.
	 */
	zip : function(array, values) 
	{
		if (jasy.Env.isSet("debug"))
		{
			core.Assert.isType(array, "Array");
			core.Assert.isType(values, "Array");
			core.Assert.equal(array.length, values.length);
		}

		var result = {};
		for (var i=0, l=array.length; i<l; i++) {
			result[array[i]] = values[i];
		}

		return result;
	},
	
	
	/**
	 * {Number} Returns the maximum number in the array.
	 */
	max : function(array) 
	{
		if (jasy.Env.isSet("debug")) {
			core.Assert.isType(array, "Array");
		}

		return Math.max.apply(Math, array);
	},
	

	/**
	 * {Number} Returns the minimum number in the array.
	 */
	min : function(array) 
	{
		if (jasy.Env.isSet("debug")) {
			core.Assert.isType(array, "Array");
		}

		return Math.min.apply(Math, array);
	},


	/**
	 * {Number} Returns the sum of all values in the array.
	 */
	sum : function(array) 
	{
		if (jasy.Env.isSet("debug")) {
			core.Assert.isType(array, "Array");
		}

		for (var i=0, l=array.length, sum=0; i<l; i++) 
		{
			if (i in array) {
				sum += array[i];
			}
		}
		
		return sum;
	},

	
	/**
	 * {any} Inserts and returns the given @value {any} at the given @position {Integer?-1}. 
	 * Supports negative position values, too. Appends to the end if no position is defined.
	 */
	insertAt : function(array, value, position) 
	{
		if (jasy.Env.isSet("debug")) 
		{
			core.Assert.isType(array, "Array");
			core.Assert.isNotUndefined(value);

			if (position != null) {
				core.Assert.isType(position, "Integer");
			}
		}

		if (position == null) {
			array.push(value)
		} 
		else 
		{
			if (position < 0) {
				position = array.length + position;
			}

			array.splice(position, 0, value);
		}

		return value;
	},
	
	
	/**
	 * {Boolean} Whether the array contains the given @value {any}.
	 */
	contains : function(array, value) 
	{
		if (jasy.Env.isSet("debug")) 
		{
			core.Assert.isType(array, "Array");
			core.Assert.isNotUndefined(value);
		}

		return array.indexOf(value) > -1;
	},
	
	
	/**
	 * {Array} Clones the whole array and returns it.
	 */
	clone : function(array) 
	{
		if (jasy.Env.isSet("debug")) {
			core.Assert.isType(array, "Array");
		}

		// Wrap method for security reaons, so params to concat are safely ignored.
		return array.concat();
	},
	
	
	/**
	 * {Array} Filters out sparse fields and returns a new compacted array.
	 */
	compact : function(array) 
	{
		if (jasy.Env.isSet("debug")) {
			core.Assert.isType(array, "Array");
		}

		var compacted = [];
		for (var i=0, l=array.length; i<l; i++)
		{
			if (i in array) {
				compacted.push(array[i]);
			}
		}

		return compacted;
	},
	
	
	/**
	 * {Array} Returns a flattened, one-dimensional copy of the array.
	 */
	flatten: function(array) 
	{
		if (jasy.Env.isSet("debug")) {
			core.Assert.isType(array, "Array");
		}

		var result = [];
		
		array.forEach(function(value) 
		{
			if (value instanceof Array) {
				result.push.apply(result, core.Array.flatten(value));
			} else {
				result.push(value);
			}
		});
	
		return result;
	},
	

	/**
	 * Randomizes the array via Fisher-Yates algorithm.
	 */
	randomize : function(array) 
	{
		if (jasy.Env.isSet("debug")) {
			core.Assert.isType(array, "Array");
		}

		for(var j, x, self=array, i=self.length; i; j = parseInt(Math.random() * i), x = self[--i], self[i] = self[j], self[j] = x);
	},
	
	
	/** 
	 * {any} Removes the given @value {any} (first occourence only) from the array and returns it.
	 */
	remove : function(array, value) 
	{
		if (jasy.Env.isSet("debug")) 
		{
			core.Assert.isType(array, "Array");
			core.Assert.isNotUndefined(value);
		}

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
		if (jasy.Env.isSet("debug")) {
			core.Assert.isType(array, "Array");
		}

		var strings = {};
		return array.filter(function(value) 
		{
			if (!strings.hasOwnProperty(value)) {
				return strings[value] = true;
			}
		});
	},
	
	
	/**
	 * {any} Returns the value at the given @position {Integer}. Supports negative indexes, too.
	 */
	at : function(array, position) 
	{
		if (jasy.Env.isSet("debug")) 
		{
			core.Assert.isType(array, "Array");
			core.Assert.isType(position, "Integer");
		}

		return array[position < 0 ? array.length + position : position];
	},
	
	
	/**
	 * {any} Returns the last item in the array.
	 */
	last: function(array) 
	{
		if (jasy.Env.isSet("debug")) {
			core.Assert.isType(array, "Array");
		}

		return array[array.length-1];
	},
	

	/** 
	 * {any} Removes and returns the value at the given @position {Integer}.
	 */
	removeAt : function(array, position) 
	{
		if (jasy.Env.isSet("debug")) 
		{
			core.Assert.isType(array, "Array");
			core.Assert.isType(position, "Integer");
		}

		var ret = array.splice(position < 0 ? array.length + position : position, 1);
		if (ret.length) {
			return ret[0];
		}
	},


	/**
	 * Removes a specific range (@from {Integer} <-> @to {Integer}) from the @array {Array}. 
	 * Supports negative indexes, too.
	 */
	removeRange : function(array, from, to) 
	{
		if (jasy.Env.isSet("debug")) 
		{
			core.Assert.isType(array, "Array");
			core.Assert.isType(from, "Integer");
			core.Assert.isType(to, "Integer");
		}

		// Based on Array Remove - By John Resig (MIT Licensed)
		// http://ejohn.org/blog/javascript-array-remove/
		
		var rest = array.slice((to || from) + 1 || array.length);
		array.length = from < 0 ? array.length + from : from;
		array.push.apply(array, rest);
	}
});

