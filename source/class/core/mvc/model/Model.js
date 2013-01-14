/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

(function() 
{
  var globalId = 0;

  /**
   * Models are the heart of any JavaScript application, 
   * containing the interactive data as well as a large 
   * part of the logic surrounding it: conversions, validations, 
   * computed properties, and access control. You extend `core.mvc.model.Model`
   * with your domain-specific methods, and `Model` provides a basic 
   * set of functionality for managing changes.
   */
  core.Class("core.mvc.model.Model", 
  {
    include: [core.property.MGeneric, core.event.MEventTarget],
    implement : [core.mvc.model.IModel],

    /**
     * Initial data structure is imported from @values {Map}.
     */
    construct: function(values) 
    {
      if (jasy.Env.isSet("debug")) 
      {
        if (values != null) {
          core.Assert.isType(values, "Map", "Invalid values to import!");
        }
      }

      // Automatically created client-side ID
      this.__clientId = "model:" + (globalId++);

      // Import given values
      if (values != null) {
        this.set(values);
      }
    },

    events :
    {
      /** Fired whenever the model is changed in a way that is interesting for listeners */
      "change" : core.event.Simple
    },

    members: 
    {
      error : function(message) {
        console.error("Model Error: " + message);
      },

      __id : null,

      // Interface implementation
      getId : function() {
        return this.__id;
      },

      // Interface implementation
      setId : function(id) {
        return this.__id = id;
      },

      __clientId : null,

      // Interface implementation
      getClientId : function() {
        return this.__clientId;
      },

      // Interface implementation
      toJSON : function() 
      {
        return this.get(Object.keys(core.Class.getProperties(this.constructor))).map(function(value) {
          value.toJSON ? value.toJSON() : value
        });
      },

      // Interface implementation
      sync : function() {
        return core.mvc.Sync.sync(this);
      }
    }
  });
})();
