/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function(global, Array, Math, undef) 
{
	/**
	 * A collection of utility methods for native JavaScript arrays.
	 *
	 * Note: Does not include specific support to deal with sparse arrays
	 * as this makes things dramatically slower. See also:
	 * http://jsperf.com/cost-of-sparse-array-support
	 */
	core.Module("core.Array", 
	{
		/**
		 * {any} Returns the value of the @array {Array} at the given 
		 * @position {Integer}. Supports negative indexes, too.
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
		 * {Array} Clones the whole @array {Array} and returns the clone.
		 */
		clone : function(array) 
		{
			if (jasy.Env.isSet("debug")) {
				core.Assert.isType(array, "Array");
			}

			return array.concat();
		},
		
		
		/**
		 * {Array} Filters out sparse fields from the given @array {Array} and 
		 * returns a new compacted array.
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
		 * {Boolean} Whether the @array {Array} contains the given @value {any}.
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
		 * {Array} Returns whether every entry in @array {Array} passes the test implemented 
		 * by the provided @callback {Function}. The @callback is executed in global context 
		 * by default, but might also be executed in the given @context {Object?global}.
		 */
		every : function(array, callback, context)
		{
			if (jasy.Env.isSet("debug")) 
			{
				core.Assert.isType(array, "Array");
				core.Assert.isType(callback, "Function");

				if (context) {
					core.Assert.isType(context, "Object");	
				}
			}

			if (!context) {
				context = global;
			}

			for (var i=0, length=array.length; i<length; i++) 
			{
				var value = array[i];
				if (!callback.call(context, value, i, array)) {
					return false;
				}
			}

			return true;
		},		
		

		/**
		 * {Array} Returns a flattened, one-dimensional copy of the @array {Array}.
		 */
		flatten: function(array) 
		{
			if (jasy.Env.isSet("debug")) {
				core.Assert.isType(array, "Array");
			}

			var result = [];

			for (var i=0, l=array.length; i<l; i++)
			{
				var value = array[i];
				if (value instanceof Array) {
					result.push.apply(result, this.flatten(value));
				} else {
					result.push(value);
				}
			}
			
			return result;
		},


		/**
		 * {Array} Returns a new array which only contains the entries of
		 * the original @array {Array} where the @callback {Function} returns `true`.
		 * The callback is executed in global context by default, but might also be 
		 * executed in the given @context {Object?global}.
		 */
		filter : function(array, callback, context)
		{
			if (jasy.Env.isSet("debug")) 
			{
				core.Assert.isType(array, "Array");
				core.Assert.isType(callback, "Function");

				if (context) {
					core.Assert.isType(context, "Object");	
				}
			}

			if (!context) {
				context = global;
			}

			var result = [];
			for (var i=0, length=array.length; i<length; i++) 
			{
				var value = array[i];
				if (callback.call(context, value, i, array)) {
					result.push(value);
				}
			}

			return result;
		},

		/**
		 * Executes the @callback {Function} in the given @context {Object?global} for
		 * every entry in the given @array {Array}.
		 */
		forEach : function(array, callback, context)
		{
			if (jasy.Env.isSet("debug")) 
			{
				core.Assert.isType(array, "Array");
				core.Assert.isType(callback, "Function");

				if (context) {
					core.Assert.isType(context, "Object");	
				}
			}

			if (!context) {
				context = global;
			}

			for (var i=0, length=array.length; i<length; i++) {
				callback.call(context, array[i], i, array);
			}
		},


		/**
		 * {Array} Converts the given @args {arguments} into an array.
		 */
		fromArguments : function(args) 
		{
			// See also: http://jsperf.com/arrayifying-arguments/7
			return args.length === 1 ? [ args[0] ] : Array.apply(null, args);
		},


		/**
		 * {any} Inserts and returns the given @value {any} at the given @position {Integer?-1}
		 * into the given @array {Array}. 
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
		 * {any} Returns the last item in the @array {Array}.
		 */
		last: function(array) 
		{
			if (jasy.Env.isSet("debug")) {
				core.Assert.isType(array, "Array");
			}

			return array[array.length-1];
		},


		/**
		 * {Array} Maps the values of the given @array {Array} to new values
		 * based on the results of the given @callback {Function}. The
		 * callback is called in optional @context {Object?global}.
		 */
		map : function(array, callback, context)
		{
			if (jasy.Env.isSet("debug")) 
			{
				core.Assert.isType(array, "Array");
				core.Assert.isType(callback, "Function");

				if (context) {
					core.Assert.isType(context, "Object");	
				}
			}

			var length = array.length;
			var result = Array(length);

			if (!context) {
				context = global;
			}

			for (var i=0; i<length; i++) {
				result[i] = callback.call(context, array[i], i, array);
			}

			return result;
		},


		/**
		 * {Number} Returns the maximum number in the @array {Array}.
		 */
		max : function(array) 
		{
			if (jasy.Env.isSet("debug")) {
				core.Assert.isType(array, "Array");
			}

			return Math.max.apply(Math, array);
		},
		

		/**
		 * {Number} Returns the minimum number in the @array {Array}.
		 */
		min : function(array) 
		{
			if (jasy.Env.isSet("debug")) {
				core.Assert.isType(array, "Array");
			}

			return Math.min.apply(Math, array);
		},
		

		/**
		 * Randomizes the @array {Array} via Fisher-Yates algorithm.
		 */
		randomize : function(array) 
		{
			if (jasy.Env.isSet("debug")) {
				core.Assert.isType(array, "Array");
			}

			for (var j, x, self=array, i=self.length; i; j = parseInt(Math.random() * i), x = self[--i], self[i] = self[j], self[j] = x);
		},
		
		
		/** 
		 * {any} Removes the given @value {any} (first occourence only) from the @array {Array} and returns it.
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
		 * {any} Removes and returns the value at the given @position {Integer} in the @array {Array}.
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
		 * {Array} Removes a specific range (@from {Integer} <-> @to {Integer}) from the @array {Array}. 
		 * Supports negative indexes, too.
		 *
		 * A few examples:
		 * 
		 * - `0` = first item
		 * - `1` = second item
		 * - `-1` = last item
		 * - `-2` = second last item
		 *
		 * To remove all but the first and last do:
		 *
		 * `core.Array.removeRange(array, 1, -2);` 
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

			return array;
		},


		/**
		 * {Array} Returns whether any entry in @array {Array} passes the test implemented 
		 * by the provided @callback {Function}. The @callback is executed in global context 
		 * by default, but might also be executed in the given @context {Object?global}.
		 */
		some : function(array, callback, context)
		{
			if (jasy.Env.isSet("debug")) 
			{
				core.Assert.isType(array, "Array");
				core.Assert.isType(callback, "Function");

				if (context) {
					core.Assert.isType(context, "Object");	
				}
			}

			if (!context) {
				context = global;
			}

			for (var i=0, length=array.length; i<length; i++) 
			{
				var value = array[i];
				if (callback.call(context, value, i, array)) {
					return true;
				}
			}

			return false;
		},		
		

		/**
		 * {Number} Returns the sum of all values in the @array {Array}.
		 */
		sum : function(array) 
		{
			if (jasy.Env.isSet("debug")) {
				core.Assert.isType(array, "Array");
			}

			for (var i=0, l=array.length, sum=0; i<l; i++) 
			{
				var value = array[i];
				if (value != null) {
					sum += array[i];	
				}
			}
			
			return sum;
		},


		/**
		 * {Map} Returns a map where the values of the given @array {Array} are used
		 * as keys. The @value {any?true} to use for each key can be defined as well.
		 */
		toKeys : function(array, value)
		{
			var undef;
			if (value === undef) {
				value = true;
			}

			var result = {};
			for (var i=0, l=array.length; i<l; i++) {
				result[array[i]] = value;
			}

			return result;
		},

		
		/**
		 * {Array} Returns a new array with all elements that are unique in @array {Array}. 
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

			var hasOwnProperty = Object.hasOwnProperty;
			var strings = {};
			var result = [];

			for (var i=0, l=array.length; i<l; i++)
			{
				var value = array[i];
				var asString = "" + value;
				
				if (!hasOwnProperty.call(strings, asString)) 
				{
					strings[asString] = true;
					result.push(value);
				}
			}

			return result;
		},
		

		/**
		 * {Map} Merges both given arrays into an object where entries of @keys {Array} are used
		 * as keys and entries of @values {Array} are used as values.
		 */
		zip : function(keys, values) 
		{
			if (jasy.Env.isSet("debug"))
			{
				core.Assert.isType(keys, "Array");
				core.Assert.isType(values, "Array");
				core.Assert.isEqual(keys.length, values.length);
			}

			var result = {};
			for (var i=0, l=keys.length; i<l; i++) {
				result[keys[i]] = values[i];
			}

			return result;
		}
	});
})(core.Main.getGlobal(), Array, Math);
