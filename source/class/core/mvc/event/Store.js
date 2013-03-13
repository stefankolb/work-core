/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Event class for storage API. Like {core.event.Simple} but with support for 
 * a new `item` field to keep the item ID which was stored/removed.
 */
core.Class("core.mvc.event.Store",
{
  pooling : true,
  include : [core.event.MDispatchable],
  implement : [core.event.IEvent],

  /**
   * @type {String} Type of the event e.g. `click`, `load`, ...
   * @succes {Boolean?true} Whether the reason for the event was a success or failure.
   * @item {var?null} Item ID to attach to the event.
   * @data {var?null} Data to be attached to the event.
   * @message {String?null} Message for user feedback etc.
   */
  construct : function(type, success, item, data, message) 
  {
    if (jasy.Env.isSet("debug"))
    {
      core.Assert.isType(type, "String", "Invalid event type!" + type + " :: " + typeof type);

      if (message != null) {
        core.Assert.isType(message, "String", "Invalid event message!");
      }
    }

    this.__type = type;
    this.__success = success == null ? true : success;
    this.__item = item;
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
     * {var} Returns the item ID attached to the event.
     */
    getItem : function() {
      return this.__item;
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
