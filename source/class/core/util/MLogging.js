/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

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

  core.Class("core.util.MLogging",
  {
    members :
    {
      log : function() {
        print(this, "log", arguments);
      },

      warn : function() {
        print(this, "warn", arguments);
      },

      error : function() {
        print(this, "error", arguments);
      }
    }
  });
})();
