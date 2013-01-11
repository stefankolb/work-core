/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

/**
 * Interface for models for fulfilling needs of typical external users.
 */
core.Interface("core.mvc.model.IModel",
{
  events :
  {
    /** 
     * Fired whenever the model do change 
     */
    change : core.event.Notification
  },

  members : 
  {
    /** 
     * {String|Number} Returns a unique identifier for this model
     */
    getId : function() {},
    
    /** 
     * Sets the a unique @identifier {String|Integer} for this model.
     */
    setId : function(identifier) {},

    /** 
     * {String} Returns a unique client side identifier for this model
     * which is automatically set on instantiation.
     */
    getClientId : function() {},    

    /**
     * {String} Exports all model data into a JSON structure.
     */    
    toJSON : function() {}
  }
});
