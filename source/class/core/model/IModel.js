/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Interface which needs to be implemented by every model.
 */
core.Interface("core.mvc.model.IModel",
{
  events :
  {
    /** 
     * Fired whenever the model did change 
     */
    change : core.event.Simple
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
     * {String} A special property of models, the client id is a unique identifier 
     * automatically assigned to all models when they're first created. Client ids 
     * are handy when the model has not yet been saved to the server, and does not 
     * yet have its eventual true id, but already needs to be visible in the UI.
     */
    getClientId : function() {},    

    /**
     * {String} Exports all model data into a JSON structure.
     */    
    toJSON : function() {},

    /**
     * {Map|Array} The function is passed the raw @data {var}, and should return the properties
     * to be set on the model. The default implementation is a no-op, simply passing 
     * through the response (which should be JSON and where the keys match the name
     * of the model properties). Override this if you need to work with a preexisting API, 
     * or better namespace your responses.
     */
    parse : function(data) {}
  }
});
