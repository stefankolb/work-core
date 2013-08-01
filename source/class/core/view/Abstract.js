/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function() 
{
  core.Class("core.view.Abstract", 
  {
    include : [core.property.MGeneric, core.event.MEventTarget, core.util.MLogging, core.locale.MTranslate],
   
    // Interface implementation
    construct: function(presenter) 
    {
      if (jasy.Env.isSet("debug")) {
        core.Assert.isType(presenter, "Object", "Invalid presenter instance!");
      }

      // Keep presenter instance
      this.__presenter = presenter;

      // Initialize data stores for labels and partials
      this.__labels = {};
      this.__partials = {};
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
      /** {=Object} Presenter instance connected to the view */
      __presenter : null,

      /** {=Map} All known labels */
      __labels : null,

      /** {=Map} All known partials */
      __partials : null,



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
        PARTIALS
      ======================================================
      */

      /**
       * {Map} Returns a map of known partials.
       */
      getPartials : function() {
        return this.__partials;
      },


      /**
       * Add the given @template {core.template.Template} as partial under with @name {String}.
       */
      addPartial : function(name, template) {
        this.__partials[name] = template;
      },


      /**
       * Registers the given @partials {Map} to the presenter.
       */
      addPartials : function(partials)
      {
        for (var name in partials) {
          this.addPartial(name, partials[name]);
        }
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

        // Automatically bind execution of any given functions to the template instance
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
