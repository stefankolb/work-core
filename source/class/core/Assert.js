/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2010-2012 Zynga Inc.
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function(undef) 
{	
	function raise(message) {
		throw new Error(message);
	}
	
	/** 
	 * Collection of assertions which could be used to verify incoming arguments, etc.
	 *
	 * Modelled after the Python API at http://docs.python.org/library/unittest.html
	 */
	core.Module("core.Assert", 
	{
		/**
		 * Raises an exception when the two values @a {var} and @b {var} are not equal (`!=`)
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isEqual: function(a, b, message) 
		{
			if (a != b) {
				raise(message || "Values must be equal: " + a + " and " + b + "!");
			}
		},


		/**
		 * Raises an exception when the two values @a {var} and @b {var} are equal (`==`). 
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isNotEqual: function(a, b, message) 
		{
			if (a == b) {
				raise(message || "Values must not be equal: " + a + " and " + b + "!");
			}
		},
		

		/**
		 * Raises an exception when the two values @a {var} and @b {var} are not identical (`!==`)
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isIdentical: function(a, b, message) 
		{
			if (a !== b) {
				raise(message || "Values must be identical: " + a + " and " + b + "!");
			}
		},


		/**
		 * Raises an exception when the two values @a {var} and @b {var} are identical (`===`). 
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isNotIdentical: function(a, b, message) 
		{
			if (a === b) {
				raise(message || "Values must not be identical: " + a + " and " + b + "!");
			}
		},

		
		/**
		 * Raises an exception when the value @a {var} is not trueish (`!= true`). 
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isTrue: function(a, message) 
		{
			if (a != true) {
				raise(message || "Value must be true: " + a + "!");
			}
		},


		/**
		 * Raises an exception when the value @a {var} is not falsy (`!= false`). 
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isFalse: function(a, message) 
		{
			if (a != false) {
				raise(message || "Value must be false: " + a + "!");
			}
		},


		/**
		 * Raises an exception when the value @a {var} is `undefined`.
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isNotUndefined : function(a, message) 
		{
			if (a === undef) {
				raise(message || "Value " + a + " must not be undefined!");
			}
		},


		/**
		 * Raises an exception when the value @a {var} is not `null`.
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isNull: function(a, message) 
		{
			if (a != null) {
				raise(message || "Value " + a + " must be null!");
			}
		},

		
		/**
		 * Raises an exception when the value @a {var} is `null`.
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isNotNull: function(a, message) 
		{
			if (a == null) {
				raise(message || "Value " + a + " must not be null!");
			}
		},


		/**
		 * Raises an exception when the value @a {var} is not in @object {Object|Array|String}. 
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isIn: function(a, object, message) 
		{
			if (!(a in object || object.indexOf && object.indexOf(a) != -1)) {
				raise(message || "Value " + a + " is not in given object!");
			}
		},


		/**
		 * Raises an exception when the value @a {var} is in @object {Object|Array|String}. 
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isNotIn: function(a, object, message) 
		{
			if (a in object || object.indexOf && object.indexOf(a) != -1) {
				raise(message || "Value " + a + " must not be in given object!");
			}
		},
		

		/**
		 * Raises an exception when the value @a {var} does not match the regular expression @regexp {RegExp}.
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		matches: function(a, regexp, message) 
		{
			if (!regexp.match(a)) {
				raise(message || "Value " + a + " must match " + regexp);
			}
		},

		
		/**
		 * Raises an exception when the value @a {var} matches the regular expression @regexp {RegExp}.
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		notMatches: function(a, regexp, message) 
		{
			if (regexp.match(a)) {
				raise(message || "Value " + a + " must not match " + regexp);
			}
		},


		/**
		 * Raises an exception when the value @a {var} is not an instance of @clazz {String}
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isInstance: function(a, clazz, message) 
		{
			if (!(a instanceof clazz)) {
				raise(message || "Value " + a + " must be instance of: " + clazz);
			}
		},		

		
		/**
		 * Raises an exception when the value @a {var} is not of @type {String} (checked via {core.Main#isTypeOf})
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isType: function(a, type, message) 
		{
			if (!core.Main.isTypeOf(a, type)) {
				raise(message || "Value " + a + " must match type: " + type);
			}
		},


		/**
		 * Raises an exception when the value @a {var} is of @type {String} (checked via {core.Main#isTypeOf})
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isNotType: function(a, type, message) 
		{
			if (core.Main.isTypeOf(a, type)) {
				raise(message || "Value " + a + " must not match type: " + type);
			}
		},


		/**
		 * {String} Validates the @object {Map} to don't hold other keys than the ones defined by @allowed {Array|String}. 
		 * Returns first non matching key which was found or `undefined` if all keys are valid.
		 */
		doesOnlyHaveKeys : function(object, allowed, message) 
		{
			if (typeof allowed == "string") {
				allowed = allowed.split(/,| /);
			}

			core.Object.forEach(object, function(value, key) 
			{
				if (allowed.indexOf(key) == -1) {
					raise(message || "Unallowed key found: " + key);
				}
			});
		},


		/**
		 * Raises an exception when the given value @a {var} is not empty.
		 * Customizable with a custom @message {String?} for the exception text.
		 */
		isNotEmpty: function(a, message) 
		{
			// Strings, Arrays
			if (Object.prototype.hasOwnProperty(a, "length")) 
			{
				if (a.length === 0) {
					raise(message || "Value " + a + " must not be empty: " + type);
				}
			}
			else if (core.Main.isTypeOf(a, "Map")) 
			{
				if (!core.Object.isEmpty(a)) {
					raise(message || "Value " + a + " must not be empty: " + type);	
				}
			}
		}
	});
	
})();

