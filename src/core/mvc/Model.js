/**
 * Models are the heart of any JavaScript application, 
 * containing the interactive data as well as a large 
 * part of the logic surrounding it: conversions, validations, 
 * computed properties, and access control. You extend Backbone.Model 
 * with your domain-specific methods, and Model provides a basic 
 * set of functionality for managing changes.
 */
core.Class("fcc.mvc.Model", 
{
  include: [core.property.MGeneric],

  construct: function(values) 
  {
    console.debug("Model Values: ", values);
    if (values != null) {
      this.set(values);
    }

  },

  members: 
  {
    toJson : function() 
    {
      var properties = Object.keys(core.Class.getProperties(this.constructor));
      return JSON.stringify(this.get(properties));
    },

    // used by property system
    fireEvent : function(type, value, old) {




    },


    bindFunction : function(callback, context) {

      if (!context) {
        context = this;
      }



    },

    addListener : function(type, callback, context) {

      var events = this.__events || {};

      if (!this.__events) {
        this.__events = events;
      }

      if (context) {
        callback = callback.bind(context);
      }

      var callbackId = core.util.Id.get(callback);
      var entryId = type + "-" + callbackId;

      var list = events[type] || [];
      if (!events[type]) {
        events[type] = [];
      } else if (events[type].indexOf(callback) != -1) {
        return false;
      }

      events[type].push(callback);
      return true;

    },

    removeListener : function(type, callback, context) {

      
    },

    hasListener : function(type, callback, context) {

    }

  }
});
