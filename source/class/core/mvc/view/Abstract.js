/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

/**
 * Views are almost more convention than they are code — they don't 
 * determine anything about the visual part of your application. The general idea is to 
 * organize your interface into logical views, backed by models, each of 
 * which can be updated independently when the model changes, without 
 * having to redraw the entire page. 
 * 
 * Instead of digging into a JSON object, 
 * looking up an element in the DOM, and updating the HTML by hand, 
 * you can bind your view's render function to the model's "change" event — 
 * and now everywhere that model data is displayed in the UI, it is 
 * always immediately up to date.
 */
core.Class("core.mvc.view.Abstract", 
{
  include : [core.property.MGeneric, core.event.MEvent],

  /**
   * @properties {Map} Properties to set initially
   */ 
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
      type: core.template.Template,
      nullable : true,
      apply : function() {
        this.render();
      }
    },

    /** The model/collection to render */
    model :
    {
      type : core.mvc.IModel,
      nullable : true,
      apply : function(value, old)
      {
        if (old) 
        {
          old.removeListener("change", this.render, this);
          old.removeListener("add", this.render, this);
          old.removeListener("remove", this.render, this);
        }

        if (value) 
        {
          value.addListener("change", this.render, this);
          value.addListener("add", this.render, this);
          value.addListener("remove", this.render, this);
        }

        this.render();
      }
    }
  },

  members :
  {
    /**
     * Renders the view using data from the attached model.
     */
    render : function() 
    {
      if (jasy.Env.isSet("debug")) {
        throw new Error("render() is abstract in core.mvc.view.Abstract!");
      }
    }
  }
});
