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

    if (values != null) {
      this.set(values);
    }
  },

  members: 
  {
    /**
     * {String} Exports all property data into a JSON structure.
     */
    toJSON : function() 
    {
      var properties = Object.keys(core.Class.getProperties(this.constructor));
      return JSON.stringify(this.get(properties));
    }
  }
});
