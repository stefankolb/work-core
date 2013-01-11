/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

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
  implement : [core.event.IEvent],

  /**
   * @target {Object} Any object which includes {core.event.MEventTarget}
   * @type {String} Type of the event e.g. `click`, `load`, ...
   * @data {var?null} Data to be attached to the event.
   * @message {String?null} Message for user feedback etc.
   */
  construct : function(target, type, data, message) 
  {
    if (jasy.Env.isSet("debug"))
    {
      core.Assert.isType(target, "object");
      core.Assert.isType(type, "string");

      if (message != null) {
        core.Assert.isType(message, "string");
      }

      if (!core.Class.includesClass(target.constructor, core.event.MEventTarget)) {
        throw new Error("Event targets must include core.event.MEventTarget!");
      }
    }

    this.__target = target;
    this.__type = type;
    this.__data = data;
    this.__message = message;
  },

  members :
  {  
    // Interface implementation
    getTarget : function() {
      return this.__target;
    },

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
