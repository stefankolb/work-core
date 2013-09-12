/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of the Modernizr project
  Copyright Modernizr, http://modernizr.com/, MIT License
==================================================================================================
*/

"use strict";

(function(document, undefined) 
{
  // Detect whether event support can be detected via `in`. Test on a DOM element
  // using the "blur" event b/c it should ƒalways exist. bit.ly/event-detection
  var needsFallback = !("onblur" in document.documentElement);

  core.Module("core.bom.HasEvent",
  {
    /**
     * @param  {string|*}           eventName  is the name of an event to test for (e.g. "resize")
     * @param  {(Object|string|*)=} element    is the element|document|window|tagName to test on
     * @return {boolean}
     */
    test : function(eventName, element) 
    {
      if (jasy.Env.isSet("debug")) {
        core.Assert.isType(eventName, "String");
      }

      if (!element || typeof element === "string") {
        element = document.createElement(element || "div");
      }

      // Testing via the `in` operator is sufficient for modern browsers and IE.
      // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and
      // "resize", whereas `in` "catches" those.
      eventName = "on" + eventName;
      var isSupported = eventName in element;

      // Fallback technique for old Firefox - bit.ly/event-detection
      if (!isSupported && needsFallback) 
      {
        // Switch to generic element if it lacks `setAttribute`.
        // It could be the `document`, `window`, or something else.
        if (!element.setAttribute) {
          element = document.createElement("div");
        }

        if (element.setAttribute && element.removeAttribute) 
        {
          element.setAttribute(eventName, "");
          isSupported = typeof element[eventName] === "function";

          if (element[eventName] !== undefined) 
          {
            // If property was created, "remove it" by setting value to `undefined`.
            element[eventName] = undefined;
          }

          element.removeAttribute(eventName);
        }
      }

      return isSupported;
    }
  });
})(document);
