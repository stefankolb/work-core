/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2014 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Event class for simple notifications style events with support
 * for a notification message and some data attached to it.
 *
 * Please note: This should rarely be used, instead better
 * develop custom event classes offering the exact methods/fields
 * for storing and accessing event specific data.
 */
core.Class("core.event.Simple",
{
  pooling : true,
  include : [core.event.MDispatchable],
  implement : [core.event.IEvent],

  /**
   * @type {String} Type of the event e.g. `click`, `load`, ...
   * @data {var?null} Data to be attached to the event.
   * @message {String?null} Message for user feedback etc.
   */
  construct : function(type, data, message)
  {
    if (jasy.Env.isSet("debug"))
    {
      core.Assert.isType(type, "String", "Invalid event type!" + type + " :: " + typeof type);

      if (message != null) {
        core.Assert.isType(message, "String", "Invalid event message!");
      }
    }

    this.__type = type;
    this.__data = data;
    this.__message = message;
  },

  members :
  {
    // Interface implementation
    getType : function() {
      return this.__type;
    },

    /**
     * {var} Returns the data attached to the event.
     */
    getData : function() {
      return this.__data;
    },

    /**
     * {String} Returns the message attached to the event.
     */
    getMessage : function() {
      return this.__message;
    }
  }
});
