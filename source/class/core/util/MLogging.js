/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function()
{
  var console = core.Main.getGlobal().console;
  var slice = Array.prototype.slice;

  var print = function(obj, method, args) 
  {
    var extended = slice.call(args);
    extended.unshift(obj.toString() + ":");

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
