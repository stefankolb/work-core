/* 
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function() 
{
  var name = "transitionend";

  if (jasy.Env.isSet("engine", "webkit")) {
    name = "webkitTransitionEnd";
  }

  var Style = core.bom.Style;

  /**
   * Adds a transition end event to the given @elem {Element}
   * which executes @callback {Function} in @contect {Object?}
   * whenever a transition on the element was finished.
   */
  var addListener = function(elem, callback, context)
  {
    if (context) {
      callback = core.Function.bind(callback, context);
    }

    elem.addEventListener(name, callback, false);
  };

  /**
   * Removes the @callback {Function} with its @context {Object?} 
   * from the transition end event of the given @elem {Element}
   */
  var removeListener = function(elem, callback, context)
  {
    if (context) {
      callback = core.Function.bind(callback, context);
    }

    elem.removeEventListener(name, callback, false);      
  };

  /**
   * Helper functions for simplifying work with CSS transitions
   */
  core.Module("core.bom.Transition",
  {
    addListener : addListener,
    removeListener : removeListener,

    /**
     * Fades in the given @elem {Element} moving @from {Map?} styles
     * to @to {Map} styles. Executes the @callback {Function?} in the
     * given @context {Object?} as soon as the fade in process was completed.
     */
    fadeIn : function(elem, from, to, callback, context)
    {
      if (from != null)
      {
        // Show element and render off screen
        Style.set(elem, "transitionDuration", "0ms");
        Style.set(elem, from);
      }

      // Show element and enforce rendering
      elem.style.display = "block";
      elem.offsetWidth;

      // Post-pone visible animation to next render frame
      core.effect.AnimationFrame.request(function()
      {
        Style.set(elem, "transitionDuration", "");
        Style.set(elem, to);
      });

      // Connect to transition end event
      var helper = function() 
      {
        removeListener(elem, helper);

        if (callback) {
          context ? callback.call(context) : callback();
        }
      };

      addListener(elem, helper);
    },


    /**
     * Fades in the given @elem {Element} moving @from {Map?} styles
     * to @to {Map} styles. Executes the @callback {Function?} in the
     * given @context {Object?} as soon as the fade in process was completed.
     */
    fadeOut : function(elem, from, to, callback, context)
    {
      if (from != null)
      {
        // Move element to origin position
        Style.set(elem, "transitionDuration", "0ms");
        Style.set(elem, from);
      }

      // Post-pone visible animation to next render frame
      core.effect.AnimationFrame.request(function()
      {
        Style.set(elem, "transitionDuration", "");
        Style.set(elem, to);
      });

      // Connect to transition end event
      var helper = function() 
      {
        removeListener(elem, helper);
        elem.style.display = "none";

        if (callback) {
          context ? callback.call(context) : callback();
        }
      };

      addListener(elem, helper);     
    }
  });
})();
