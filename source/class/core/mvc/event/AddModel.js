/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

/**
 * Event class which is fired whenever a model is added to a collection.
 */
core.Class("core.mvc.event.AddModel", 
{
  pooling: true,
  implement : [core.event.IEvent],

  /**
   * @model {core.mvc.model.IModel} Model which was added
   */
  construct: function(model, target) 
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
      return "add";
    },
    
    /**
     * {core.mvc.model.IModel} Returns the added model.
     */
    getModel : function() {
      return this.__model;
    }
  }
});
