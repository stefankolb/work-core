/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013-2014 Sebastian Werner
==================================================================================================
*/

"use strict";

/* jshint -W098 */

(function()
{
  var console = core.Main.getGlobal().console;
  var slice = Array.prototype.slice;

  var print = function(obj, method, args)
  {
    var extended = slice.call(args);
    extended.unshift(obj.toString() + ":");

    // Android's system browser does not support multi arguments on console instances (via ADB)
    if (jasy.Env.isSet("runtime", "browser"))
    {
      if (core.detect.Browser.NAME == "android")
      {
        console[method](extended.join(" "));
        return;
      }
    }

    // Failsafe output of multiple arguments
    // e.g. IE8 does not support apply on console methods.
    try{
      console[method].apply(console, extended);
    } catch(ex) {
      console[method](extended.join(" "));
    }
  };

  /**
   * Integrate logging support into {core.Class} based classes.
   */
  core.Class("core.util.MLogging",
  {
    members :
    {
      /**
       * Logs the given log @message {any...}.
       */
      log : function(message) {
        print(this, "log", arguments);
      },


      /**
       * Prints out the given warning @message {any...}.
       */
      warn : function(message) {
        print(this, "warn", arguments);
      },


      /**
       * Print the given error @message {any...}.
       */
      error : function(message) {
        print(this, "error", arguments);
      }
    }
  });
})();
