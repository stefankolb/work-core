/**
 * Models are the heart of any JavaScript application, 
 * containing the interactive data as well as a large 
 * part of the logic surrounding it: conversions, validations, 
 * computed properties, and access control. You extend Backbone.Model 
 * with your domain-specific methods, and Model provides a basic 
 * set of functionality for managing changes.
 */
core.Class("core.mvc.Model", 
{
  include: [core.property.MGeneric, core.event.MEvent],

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
    }

  }
});
