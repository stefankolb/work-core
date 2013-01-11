/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

/**
 * Event class for simple notifications and optional data
 * to attach to the event. 
 * 
 * Please note: This should rarely be used, better
 * develop custom events offering the exact methods/fields
 * for storing and accessing event specific data.
 */
core.Class("core.event.Simple",
{
  pooling : true,

  /**
   * @data {Object|Array} Data to be attached to the event
   * @message {String} Message for user feedback etc.
   */
  construct : function(type, data, message) 
  {
    this.__type = type;
    this.__data = data;
    this.__message = message;
  },

  members :
  {  
    /**
     * {String} Returns the type of the event.
     */
    getType : function() {
      return this.__type;
    },


    /**
     * {Object|Array} Returns the data attached to the event.
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
