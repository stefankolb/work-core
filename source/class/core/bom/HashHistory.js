/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of the Unify project
  2009-2010 Deutsche Telekom AG, Germany, http://telekom.com
==================================================================================================
*/

"use strict";

(function()
{
  /** {=Boolean} Whether the browser supports the native hash change event */
  var supportsHashChange = (function()
  {
    if (core.bom.HasEvent.test("hashchange", window) === false) {
      return false;
    }

    // documentMode logic from YUI to filter out IE8 Compat Mode which false positives.
    return (document.documentMode === undefined || document.documentMode > 7);  
  })();


  /**
   * Hash-based browser history management
   */
  core.Class("core.bom.HashHistory", 
  {  
    include : [core.event.MEventTarget],

    construct : function()
    {
      // Init callback
      var callback = core.Function.bind(this.__onCallback, this);

      // HTML5 hashchange supported by IE>=8, Firefox>=3.6, Webkit (!Safari 4)
      // See also: https://bugs.webkit.org/show_bug.cgi?id=21605
      // https://developer.mozilla.org/en/DOM/window.onhashchange
      if (supportsHashChange) {
        window.addEventListener("hashchange", callback);
      } else {
        this.__intervalHandler = setInterval(callback, 100);
      }
    },



    /*
    ----------------------------------------------------------------------------
       EVENTS
    ----------------------------------------------------------------------------
    */

    events :
    {
      /** Fired every time the history is modified */
      change : core.event.Simple
    },



    /*
    ----------------------------------------------------------------------------
       MEMBERS
    ----------------------------------------------------------------------------
    */

    members :
    {
      /**
       * Returns the current location
       *
       * @return {String} Current location without leading "#"
       */
      getLocation : function() {
        return this.__location;
      },


      /**
       * Change hash to the given hash. Completely replaces current location.
       *
       * @param value {String} A valid URL hash without leading "#".
       */
      setLocation : function(value)
      {
        var old = this.__location;
        if (value != old)
        {
          this.__location = value;
          this.fireEvent("change", value, old);

          location.hash = "#" + encodeURI(value);
        }
      },


      /**
       * Should be called after the page is loaded to
       * show the the content based on the loaded hash
       * or go to the default screen.
       *
       * @param defaultPath {String} Default path to jump to,
       *   when no one is given through URL
       */
      init : function(defaultPath)
      {
        if (location.hash) {
          this.setLocation(decodeURI(location.hash.substring(1)));
        } else if (defaultPath != null) {
          this.setLocation(defaultPath);
        }
      },




      /*
      ---------------------------------------------------------------------------
        INTERNALS
      ---------------------------------------------------------------------------
      */

      /** {Timer} Handle for timeout */
      __intervalHandler : null,

      /** {String} Internal storage field for current location */
      __location : "",

      /**
       * Internal listener for interval. Used to check for history changes. Converts
       * the native changes to the instance and fires synthetic events to the outside.
       *
       * @param e {Event} Native interval event
       */
      __onCallback : function(e)
      {
        var value = decodeURI(location.hash.substring(1));
        var old = this.__location;

        if (value != old)
        {
          this.__location = value;
          this.fireEvent("change", value, old);
        }
      }
    }
  });
})();

