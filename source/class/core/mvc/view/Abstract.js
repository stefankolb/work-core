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
 * Instead of digging into a JSON object or class instance, 
 * looking up an element in the DOM, and updating the HTML by hand, 
 * you can bind your view's render function to the model's "change" event — 
 * and now everywhere that model data is displayed in the UI, it is 
 * always immediately up to date.
 */
core.Class("core.mvc.view.Abstract", 
{
  include : [core.property.MGeneric, core.event.MEventTarget, core.util.MLogging],

  /**
   * @presenter {core.mvc.presenter.Abstract} Presenter instance to connect to
   */ 
  construct: function(presenter) 
  {
    core.Main.isTypeOf(presenter, "Object", "Invalid presenter instance!");

    this.__presenter = presenter;
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
    }
  },

  members :
  {
    /**
     * {core.mvc.presenter.Abstract} Returns the attached presenter instance
     */
    getPresenter : function() {
      return this.__presenter;
    },


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
