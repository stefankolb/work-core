/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function() 
{
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

      /**
       * {Map} Returns a map of registered labels.
       */
      getLabels : function() {
        return this.__labels;
      },


      /**
       * Registers a label with the @name {String} and a possible
       * static string or function @textOrFunction {any}.
       */
      addLabel : function(name, textOrFunction) 
      {
        if (jasy.Env.isSet("debug"))
        {
          core.Assert.isType(name, "String", "The label name must be type of string!");
          
          if (typeof textOrFunction != "string" && typeof textOrFunction != "function") {
            throw new Error("The label value must be either type of string or function!");
          }
        }

        if (typeof textOrFunction == "function") {
          textOrFunction = textOrFunction.bind(this);
        }

        this.__labels[name] = textOrFunction;
      },


      /**
       * Registers the given @labels {Map} to the presenter.
       */
      addLabels : function(labels)
      {
        for (var name in labels) {
          this.addLabel(name, labels[name]);
        }
      }
    }
  });
})();
