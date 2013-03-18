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
	var hasOwnProperty = Object.hasOwnProperty;

  // Used to fix the JScript [[DontEnum]] bug 
  var shadowed = 
  [
    'constructor', 
    'hasOwnProperty', 
    'isPrototypeOf', 
    'propertyIsEnumerable',
    'toLocaleString', 
    'toString', 
    'valueOf'
  ];
  var shadowedLength = shadowed.length;

	// Fix for IE bug with enumerables
	var hasDontEnumBug = true;
	for (var key in {"toString": null}) {
		hasDontEnumBug = false;	
	}

	var keys = Object.keys;
	if (!keys)
	{
		var keys = function(object) 
		{
			var result = [];
			for (var key in object) {
				result.push(key);
			}

			if (hasDontEnumBug) 
			{
				for (var i=0; i<shadowedLength; i++) 
				{
					var key = shadowed[i];
					if (hasOwnProperty.call(object, key)) {
						result.push(key);
					}
				}
			}

			return result;
		};
	}
	
	core.Module("core.Object", 
	{
		/**
		 * {Integer} Returns the number of keys the given @object {Object} has.
		 */
		getLength : function(object) 
		{
			var count = 0;

			if (hasDontEnumBug) 
			{
				for (var i=0; i<shadowedLength; i++) 
				{
					if (hasOwnProperty.call(object, shadowed[i])) {
						count++;
					}
				}
			}

			for (var key in object) 
			{
				if (hasOwnProperty.call(object, key)) {
					count++;	
				}
			}

			return count;
		},
		
		
		/**
		 * {Map} Creates a new object with prefilled content from the @keys {Array} list.
		 * The @value {var ? true} is always the same, defaults to true, but is also configurable.
		 */
		fromArray : function(keys, value) 
		{
			if (arguments.length == 1) {
				value = true;
			}

			var obj = {};
			for (var i=0, l=keys.length; i<l; i++) {
				obj[keys[i]] = value;
			}

			return obj;
		},


		/**
		 * {Boolean} Tests whether the given @object {Object} is empty.
		 */
		isEmpty: function(object) 
		{
			for (var key in object) 
			{
				if (hasOwnProperty.call(object, key)) {
					return false;
				}
			}
			
			if (hasDontEnumBug) 
			{
				for (var i=0; i<shadowedLength; i++) 
				{
					if (hasOwnProperty.call(object, shadowed[i])) {
						return false;
					}
				}
			}

			return true;
		},


		keys : keys,


		/**
		 * {Array} Returns all the values of the given @object {Map}.
		 */
		values : function(object) 
		{
			return keys(object).map(function(key) {
				return object[key];
			});
		},


		/**
		 * {Map} Create a shallow-copied clone of the @object {Map}. Any nested 
		 * objects or arrays will be copied by reference, not duplicated.
		 */
		clone : function(object) 
		{
			var result = {};
			for (var key in object) {
				result[key] = object[key];
			}

			return result;
		},


		/**
		 * {Map} Returns a copy of the @object {Map}, filtered to only have values for the whitelisted @keys {String...}.
		 */
		pick : function(object, keys) 
		{
			var result = {};
			var args = arguments;

			for (var i=1, l=args.length; i<l; i++) 
			{
				var key = args[i];
				result[key] = object[key];
			}

			return result;
		},
		
		
	  /**
	   * {Map} Returns a copy of the incoming @map {Map} where the 
	   * keys in @table {Map} are translated. All keys which are not
	   * listed in @table are just copied over to the result object.
	   */
	  translate : function(map, table)
	  {
	    var result = {};
	    for (var key in map) {
	      result[table[key] || key] = map[key];
	    }

	    return result;
	  },


		/**
		 * {String} Validates the @object {Map} to don't hold other keys than the ones defined by @allowed {Array}. 
		 * Returns first non matching key which was found or `undefined` if all keys are valid.
		 */
		validateKeys : function(object, allowed) 
		{
			// Build lookup table
			var set = {};
			for (var i=0, l=allowed.length; i<l; i++) {
				set[allowed[i]] = true;
			}

			// Collect used keys
			var list = keys(object);

			// Validate keys
			var invalid = [];
			for (var i=0, l=list.length; i<l; i++) 
			{
				var current = list[i];
				if (!set[current]) {
					invalid.push(current);
				}
			}

			return invalid;
		}
	});
	
})();


