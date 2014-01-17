/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013-2014 Sebastian Fastner
==================================================================================================
*/

"use strict";

/**
 * Event class for storage API. Like {core.event.Simple} but with support for
 * a new `item` field to keep the item ID which was stored/removed.
 */
core.Class("core.store.Event",
{
	pooling : true,
	include : [core.event.MDispatchable],
	implement : [core.event.IEvent],

	/**
	 * @type {String} Type of the event e.g. `click`, `load`, ...
	 * @success {Boolean} Whether the reason for the event was a success or failure.
	 * @key {var?null} Key pointing to storage data.
	 * @value {var?null} Value read from storage.
	 */
	construct : function(type, success, key, value)
	{
		if (jasy.Env.isSet("debug"))
		{
			core.Assert.isType(type, "String", "Invalid event type!" + type + " :: " + typeof type);
			core.Assert.isType(success, "Boolean", "Invalid event success state!");
		}

		this.__type = type;
		this.__success = success;
		this.__key = key;
		this.__value = value;
	},

	members :
	{
		// Interface implementation
		getType : function() {
			return this.__type;
		},

		/**
		 * {var} Returns whether the reason for the event is a success.
		 */
		isSuccessful : function() {
			return this.__success;
		},

		/**
		 * {var} Returns whether the reason for the event is a failure..
		 */
		isErrornous : function() {
			return !this.__success;
		},

		/**
		 * {var} Returns the data attached to the event.
		 */
		getKey : function() {
			return this.__key;
		},

		/**
		 * {String} Returns the message attached to the event.
		 */
		getValue : function() {
			return this.__value;
		}
	}
});
