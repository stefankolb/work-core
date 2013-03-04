/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

(function() 
{
  var Translate = core.locale.Translate;
  var slice = Array.prototype.slice;

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

      addLabel : function(name, text) {
        this.__labels[name] = text;
      },

      getLabel : function(name) {
        return this.__labels[name];
      },




      /*
      ======================================================
        TRANSLATION
      ======================================================
      */

      /**
       * {String} Translates the given @message {String} and replaces any numeric placeholders 
       * (`%[0-9]`) with the corresponding number arguments passed via @varargs {var...?}.
       */
      tr : function(message, varargs) {
        return Translate.tr.apply(Translate, slice.call(arguments));
      },


      /**
       * {String} Translates the given @message {String} und while choosing the one which matches the 
       * given @context {String} and replaces any numeric placeholders (`%[0-9]`) with the corresponding 
       * number arguments passed via @varargs {var...?}.
       */
      trc : function(message, varargs) {
        return Translate.trc.apply(Translate, slice.call(arguments));
      },


      /**
       * {String} Translates the given @messageSingular {String} or @messagePlural {String} 
       * depending on the @number {Number} passed to the method.
       * Like the other methods it also supports replacing any numeric placeholders 
       * (`%[0-9]`) with the corresponding number arguments passed via @varargs {var...?}.
       */
      trn : function(message, varargs) {
        return Translate.trn.apply(Translate, slice.call(arguments));
      },


      /**
       * Optimized method being used by Jasy-replaced `trn()` method
       */
      trnc : function(message, varargs) {
        return Translate.trnc.apply(Translate, slice.call(arguments));
      }
    }
  });
})();
