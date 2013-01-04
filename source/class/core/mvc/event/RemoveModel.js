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
  include : [core.event.MEvent],

  construct: function(model) {
    this.model = model;
  },

  members: 
  {
    type : "remove",

    getType : function() {
      return this.type;
    },
    
    getModel : function() {
      return this.model;
    }
  }
});
