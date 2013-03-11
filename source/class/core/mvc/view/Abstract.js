/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function() 
{
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
    include : [core.property.MGeneric, core.event.MEventTarget, core.util.MLogging, core.locale.MTranslate],
   
    // Interface implementation
    construct: function(presenter) 
    {
      if (jasy.Env.isSet("debug"))
      {
        core.Assert.isType(presenter, "Object", "Invalid presenter instance!");

        if (!core.Class.includesClass(presenter.constructor, core.mvc.presenter.Abstract)) {
          throw new Error("Presenter classes should include the abstract class 'core.mvc.presenter.Abstract': " + presenter.constructor.className + "!");
        }
      }

      this.__presenter = presenter;

      this.__labels = {};
      this.__dynamicLabels = {};
    },

    events :
    {
      /** Fired after the view has been shown */
      "show" : core.event.Simple,

      /** Fired after the view has been hidden */
      "hide" : core.event.Simple
    },

    members :
    {
      /*
      ======================================================
        INTEGRATION
      ======================================================
      */

      // Interface implementation
      getPresenter : function() {
        return this.__presenter;
      },



      /*
      ======================================================
        LABELS
      ======================================================
      */

      getLabels : function() {
        return this.__labels;
      },

      addLabel : function(name, text) {
        this.__labels[name] = text;
      },

      addDynamicLabel : function() {

      }
    }
  });
})();
