/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

/**
 * Contains all relevant data fields for property change events.
 */
core.Class("core.property.Event", 
{
  pooling: true,
  include : [core.event.MBasicEvent],

  /**
   * Creates a new event object with the given @type {String}. It stores the current @value {var}, 
   * the @old {var?} value and the @name {String?} of the property which was modified.
   */
  construct : function(type, value, old, name) 
  {
    this.__type = type;
    this.__value = value;
    this.__old = old;
    this.__name = name;
  },

  members : 
  {
    /** {=var} Type of event */
    __type : null,

    /** {=var} Current property value */
    __value : null,

    /** {=var} Previous property value */
    __old : null,

    /** {=var} Property name */
    __name : null,

    /**
     * {var} Returns event type
     */
    getType : function() {
      return this.__type;
    },

    /**
     * {var} Returns the current property value
     */
    getValue : function() {
      return this.__value;
    },

    /**
     * {var} Returns the previous property value
     */
    getOldValue : function() {
      return this.__old;
    },

    /**
     * {String} Returns the name of the property
     */
    getName : function() {
      return this.__name;
    }
  }
});
