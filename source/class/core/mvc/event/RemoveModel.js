/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

/**
 * Event class which is fired whenever a model is removed from a collection.
 */
core.Class("core.mvc.event.RemoveModel", 
{
  pooling: true,
  include : [core.event.MBasicEvent],
  implement : [core.event.IEvent],

  /**
   * @model {core.mvc.model.IModel} Model which was removed
   */
  construct: function(model) {
    this.__model = model;
  },

  members: 
  {
    // Interface implementation
    getType : function() {
      return "remove";
    },
    
    /**
     * Sets the added {core.mvc.model.IModel}.
     */
    setModel : function(model) {
      this.__model = model;
    },
    
    /**
     * {core.mvc.model.IModel} Returns the removed model.
     */    
    getModel : function() {
      return this.__model;
    }
  }
});
