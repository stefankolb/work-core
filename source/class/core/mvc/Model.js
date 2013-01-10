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
   * computed properties, and access control. You extend `core.mvc.Model`
   * with your domain-specific methods, and `Model` provides a basic 
   * set of functionality for managing changes.
   */
  core.Class("core.mvc.Model", 
  {
    include: [core.property.MGeneric, core.event.MEvent],
    implement : [core.mvc.IModel],

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
      this.cid = "model:" + (globalId++);

      // Import given values
      if (values != null) {
        this.set(values);
      }
    },

    events :
    {
      /** Fired whenever the model is changed in a way that is interesting for listeners */
      "change" : core.event.Notification
    },

    members: 
    {
      error : function(message) {
        console.error("Model Error: " + message);
      },

      id : null,

      // Interface implementation
      getId : function() {
        return this.id;
      },

      // Interface implementation
      setId : function(id) {
        return this.id = id;
      },

      // Interface implementation
      getClientId : function() {
        return this.cid;
      },

      // Interface implementation
      toJSON : function() {
        return this.get(Object.keys(core.Class.getProperties(this.constructor)));
      },

      // Interface implementation
      sync : function() {
        return core.mvc.Sync.sync(this);
      }
    }
  });
})();
