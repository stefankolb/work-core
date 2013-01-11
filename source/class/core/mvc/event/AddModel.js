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
  include : [core.event.MDispatchable],
  implement : [core.event.IEvent],

  /**
   * @model {core.mvc.model.IModel} Model which was added
   */
  construct: function(model) {
    this.__model = model;
  },

  members: 
  {
    // Interface implementation
    getType : function() {
      return "add";
    },
    
    /**
     * Sets the added {core.mvc.model.IModel}.
     */
    setModel : function(model) {
      this.__model = model;
    },

    /**
     * {core.mvc.model.IModel} Returns the added model.
     */
    getModel : function() {
      return this.__model;
    }
  }
});
