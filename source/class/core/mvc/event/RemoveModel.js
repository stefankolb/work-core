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
  implement : [core.event.IEvent],

  /**
   * @model {core.mvc.model.IModel} Model which was removed
   */
  construct: function(model) 
  {
    this.__model = model;
    this.__target = target;
  },

  members: 
  {
    // Interface implementation
    getTarget : function() {
      return this.__target;
    },

    // Interface implementation
    getType : function() {
      return "remove";
    },
    
    /**
     * {core.mvc.model.IModel} Returns the removed model.
     */    
    getModel : function() {
      return this.__model;
    }
  }
});
