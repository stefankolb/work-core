/**
 * Views are almost more convention than they are code — they don't 
 * determine anything about your HTML or CSS for you, and can be used 
 * with any JavaScript templating library. The general idea is to 
 * organize your interface into logical views, backed by models, each of 
 * which can be updated independently when the model changes, without 
 * having to redraw the page. Instead of digging into a JSON object, 
 * looking up an element in the DOM, and updating the HTML by hand, 
 * you can bind your view's render function to the model's "change" event — 
 * and now everywhere that model data is displayed in the UI, it is 
 * always immediately up to date.
 */
core.Class("core.mvc.View", 
{
  include : [core.event.MEvent, core.property.MGeneric],
  
  construct: function(properties) 
  {
  
    if (properties) {
      this.set(properties);
    }

  },


  properties : 
  {
    /** Instance of compiled template to produce final data / text for output e.g. HTML, JSON, ... */
    template : 
    {
      check: core.template.Template,
      nullable : true
    },

    /** The model to render - use either `model` or `collection`*/
    model :
    {
      check : core.mvc.Model,
      nullable : true
    },

    /** The collection to render - use either `model` or `collection`*/
    collection : 
    {
      check : core.mvc.Collection,
      nullable : true
    },







  },

  members :
  {
    /**
     *
     */
    render : function() {

    }


  }
});
