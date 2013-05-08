/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function() 
{
  var globalId = 0;

  /**
   * Models hold the current state of the application. This basic models provides
   * a simple key/value store and event based notifications.
   */
  core.Class("core.mvc.model.Model", 
  {
    include: [core.property.MGeneric, core.event.MEventTarget, core.util.MLogging],
    implement : [core.mvc.model.IModel],

    /**
     * Initial data structure is imported from @data {any}.
     * Initial @parent {Object} can also be passed in.
     */
    construct: function(data, parent) 
    {
      // Automatically created client-side ID
      this.__clientId = "model-" + (globalId++);

      // Attach parent when given (e.g. a collection or presenter)
      if (parent != null) {
        this.__parent = parent;  
      }

      // Import given values with parse method
      if (data != null) 
      {
        var values = this.parse(data);

        if (jasy.Env.isSet("debug")) {
          core.Assert.isType(values, "Map", "Invalid values to import!");
        }

        this.set(values);
      }
    },

    events :
    {
      /** Fired whenever the model is changed in a way that is interesting for listeners */
      change : core.event.Simple
    },

    properties :
    {
      /** Unique ID of the model instance */
      id : 
      {
        type : "String",
        nullable : true
      }
    },

    members: 
    {
      /** {String} Internal storage field for client ID */
      __clientId : null,

      /**
       * Returns the assigned parent 
       */
      getEventParent : function() {
        return this.__parent;
      },

      setParent : function(parent) {
        this.__parent = parent;
      },

      getParent : function() {
        return this.__parent;
      },



      // Interface implementation
      parse : function(data) {
        return data;
      },

      // Interface implementation
      getClientId : function() {
        return this.__clientId;
      },

      // Interface implementation
      toJSON : function() 
      {
        // Typically uses all existing properties
        // Override the method if you need to include other fields

        var values = this.get(core.Object.getKeys(core.Class.getProperties(this.constructor)));

        for (var name in values) 
        {
          var value = values[name];
          if (value != null && value.toJSON) {
            values[name] = value.toJSON();
          }
        }

        return values;
      }
    }
  });
})();
