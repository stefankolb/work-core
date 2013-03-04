/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

(function(global) 
{
  var immediate;

  // Try NodeJS style nextTick() API
  // http://howtonode.org/understanding-process-next-tick
  if (global.process && process.nextTick) 
  {
    immediate = process.nextTick;
  }
  else
  {
    // Try experimental setImmediate() API
    // https://developer.mozilla.org/en-US/docs/DOM/window.setImmediate
    immediate = core.util.Experimental.get(global, "setImmediate");

    // Last fallback: Timeout
    if (!immediate)
    {
      immediate = function(func) {
        return setTimeout(func, 0);
      };
    }
  }

  /**
   * Utilities for functions
   */
  core.Module("core.util.Function", 
  {
    /**
     * {Function} Binds the given function @func {Function} to the given @object {Object} and returns 
     * the resulting function. 
     * 
     * - Only one connection is made to allow proper disconnecting without access to the bound function. 
     * - Uses ES5 bind() to connect functions to objects internally.
     *
     * Inspired by: http://webreflection.blogspot.de/2012/11/my-name-is-bound-method-bound.html
     *
     * #require(ext.FunctionBind)
     */
    bind : function(func, object) 
    {
      // Using name which is not common to store these references in their objects
      // Storing it on the object has the benefit that when the object is 
      // garbage collected its bound methods are gone as well.
      var boundName = "bound:" + core.util.Id.get(func);

      return object[boundName] || (
        object[boundName] = func.bind(object)
      );
    },


    /**
     * {Function} Debounces the given method.
     *
     * Debouncing ensures that exactly one signal is sent for an event that may be happening
     * several times — or even several hundreds of times over an extended period. As long as
     * the events are occurring fast enough to happen at least once in every detection
     * period, the signal will not be sent!
     *
     * - @threshold {Integer} Number of milliseconds of distance required before reacting/resetting.
     * - @execAsap {Boolean?false} Whether the execution should happen at begin.
     */
    debounce : function(func, threshold, execAsap)
    {
      // Via: http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
      var timeout;

      return function()
      {
        var obj = this, args = arguments;
        function delayed()
        {
          if (!execAsap) {
            func.apply(obj, args);
          }

          timeout = null;
        };

        if (timeout){
          clearTimeout(timeout);
        } else if (execAsap) {
          func.apply(obj, args);
        }

        timeout = setTimeout(delayed, threshold || 100);
      };
    },
    
    
    /**
     * {Function} Returns a new function that when called multiple times will only call the 
     * original function after the specificed @time {Integer} in milliseconds has elapsed.
     */
    throttle : function(func, time) 
    {
      var lastEventTimestamp = null;
      var limit = time;

      return function() 
      {
        var self = this;
        var args = arguments;
        var now = Date.now();

        if (!lastEventTimestamp || now - lastEventTimestamp >= limit) 
        {
          lastEventTimestamp = now;
          func.apply(self, args);
        }
      };
    },


    /**
     * Executes the given @func {Function} immediately, but not in the current 
     * thread (non-blocking). Optionally is able to call the method in the given
     * @context {Object?}.
     */ 
    immediate : function(func, context)
    {
      if (context) {
        func = this.bind(func, context);
      }

      immediate(func);
    }

  });  
})(core.Main.getGlobal());
