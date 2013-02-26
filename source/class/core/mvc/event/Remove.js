/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

/**
 * Event class which is fired whenever a model is removed from a collection.
 */
core.Class("core.mvc.event.Remove", 
{
  pooling: true,
  include : [core.event.MDispatchable],
  implement : [core.event.IEvent],

  /**
   * @item {Object} Item which was added
   */
  construct: function(item) {
    this.__item = item;
  },

  members: 
  {
    // Interface implementation
    getType : function() {
      return "remove";
    },
    
    /**
     * Sets the removed @item {Object}.
     */
    setItem : function(item) {
      this.__item = item;
    },

    /**
     * {Object} Returns the removed item.
     */
    getItem : function() {
      return this.__item;
    }
  }
});
