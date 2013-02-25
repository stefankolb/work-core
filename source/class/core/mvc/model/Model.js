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
    include: [core.property.MGeneric, core.event.MEventTarget, core.util.MLogging],
    implement : [core.mvc.model.IModel],

    /**
     * Initial data structure is imported from @data {var}.
     */
    construct: function(data, parent) 
    {
      // Automatically created client-side ID
      this.__clientId = "model-" + (globalId++);

      // Attach parent when given
      if (parent) {
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
      // Model Interface implementation
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

      // Interface implementation
      parse : function(data) {
        return data;
      },

      // Interface implementation
      getClientId : function() {
        return this.__clientId;
      },

      __parent : null,

      setParent : function(parent) {
        this.__parent = parent;
      },

      getParent : function(parent) {
        return this.__parent;
      },

      /**
       * Alternative to getParent() as used for event handling (bubbling/capturing)
       */
      getEventParent : function() {
        return this.__parent;
      },

      // Interface implementation
      toJSON : function() 
      {
        // Typically uses all existing properties
        // Override the method if you need to include other fields

        var values = this.get(Object.keys(core.Class.getProperties(this.constructor)));

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
