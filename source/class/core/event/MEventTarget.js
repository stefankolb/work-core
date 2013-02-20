/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

(function() 
{
  var getHandlers = function(object, type) 
  {
    var events = object.__events || (object.__events = {});
    return events[type] || (events[type] = []);
  };

  var slice = Array.prototype.slice;

  var getTargets = function(obj) 
  {
    if (!obj.getEventParent) {
      return [obj];
    }

    // Bubble phase
    var bubble = [];
    while (obj.getEventParent && (obj = obj.getEventParent())) {
      bubble.push(obj);
    }

    // Capture phase = reversed bubble phase
    var capture = bubble.slice().reverse();

    // Add self in between both phases
    capture.push(obj);

    // Merged
    return capture.concat(bubble);
  };


  /**
   * Generic event interface for Core classes.
   */
  core.Class("core.event.MEventTarget", 
  {
    members :
    {
      /**
       * {Boolean} Registers a listener of the given @type {String} of event to 
       * execute the @callback {Function} in the given @context {Object?}. Returns
       * whether adding the listener was successful.
       */
      addListener : function(type, callback, context) 
      {
        if (jasy.Env.isSet("debug")) 
        {
          core.Assert.isType(type, "String", "Invalid event type - non string!");
          core.Assert.isNotEmpty(type, "Invalid event type - empty string!");
          core.Assert.isType(callback, "Function", "Invalid event callback!");

          if (context != null) {
            core.Assert.isType(context, "Object", "Invalid execution context!");
          }
        }

        // Simplify internal storage using Function.bind()
        if (context) {
          callback = core.util.Function.bind(callback, context);
        }

        var handlers = getHandlers(this, type);

        if (handlers.indexOf(callback) != -1) {
          return false;
        }

        handlers.push(callback);
        return true;
      },


      /** 
       * {Boolean} Like {#addListener} but executes the @callback {Function} for the event @type {String}
       * only on the first event and then unregisters the @callback automatically. 
       * Supports @context {Object?} for defining the execution context as well. Returns
       * whether adding the listener was successful.
       */
      addListenerOnce : function(type, callback, context) 
      {
        if (jasy.Env.isSet("debug")) 
        {
          core.Assert.isType(type, "String", "Invalid event type!");
          core.Assert.isNotEmpty(type, "Invalid event type!");
          core.Assert.isType(callback, "Function", "Invalid event callback!");

          if (context != null) {
            core.Assert.isType(context, "Object", "Invalid execution context!");
          }
        }

        var self = this;

        if (self.hasListener(type, callback, context)) {
          return false;
        }          

        var wrapper = function() 
        {
          self.removeListener(type, wrapper);
          return callback.apply(context||self, arguments);
        };

        return this.addListener(type, wrapper);
      },


      /**
       * {Boolean} Removes a listener of the given @type {String} of event to 
       * execute the @callback {Function} in the given @context {Object?}. Returns
       * whether removing the listener was successful.
       */
      removeListener : function(type, callback, context) 
      {
        if (jasy.Env.isSet("debug")) 
        {
          core.Assert.isType(type, "String", "Invalid event type!");
          core.Assert.isNotEmpty(type, "Invalid event type!");
          core.Assert.isType(callback, "Function", "Invalid event callback!");

          if (context != null) {
            core.Assert.isType(context, "Object", "Invalid execution context!");
          }
        }

        // Simplify internal storage using Function.bind()
        if (context) {
          callback = core.util.Function.bind(callback, context);
        }

        var handlers = getHandlers(this, type);

        var position = handlers.indexOf(callback);
        if (position == -1) {
          return false;
        }

        handlers.splice(position, 1);
        return true;
      },


      /**
       * Removes all listeners from this object with optional
       * support for only removing events of the given @type {String?}.
       */
      removeAllListeners : function(type) 
      {
        if (jasy.Env.isSet("debug")) 
        {
          if (type != null) 
          {
            core.Assert.isType(type, "String", "Invalid event type!");
            core.Assert.isNotEmpty(type, "Invalid event type!");
          }
        }

        if (type != null) {
          getHandlers(this, type).length = 0;
        } else {
          this.__events = {};
        }
      },


      /**
       * {Boolean} Returns whether the given event @type {String} has any listeners.
       * The method could optionally figure out whether a specific
       * @callback {Function?} (with optional @context {Object?}) is 
       * registered already.
       */
      hasListener : function(type, callback, context) 
      {
        if (jasy.Env.isSet("debug")) 
        {
          core.Assert.isType(type, "String", "Invalid event type!");
          core.Assert.isNotEmpty(type, "Invalid event type!");

          if (callback != null) 
          {
            core.Assert.isType(callback, "Function", "Invalid event callback!");

            if (context != null) {
              core.Assert.isType(context, "Object", "Invalid execution context!");
            }
          }
        }

        var handlers = getHandlers(this, type);

        // Short path for callback-less usage.
        if (!callback) {
          return handlers.length > 0;
        }

        // Simplify internal storage using Function.bind()
        if (context) {
          callback = core.util.Function.bind(callback, context);
        }
        
        return handlers.indexOf(callback) != -1;
      },


      /**
       * {Boolean} Dispatches the given @eventObject {Object} on this object. 
       * The object can be an arbitrary Object with a valid `type` information.
       * The method returns whether any listers were processed.
       */
      dispatchEvent : function(eventObject)
      {
        var eventType = eventObject.getType();
        var eventTarget = this;

        if (jasy.Env.isSet("debug")) 
        {
          core.Assert.isType(eventObject, "Object", "Invalid event object to dispatch!");
          if (!eventObject.setTarget) {
            console.error(eventObject)
          }

          core.Assert.isType(eventObject.setTarget, "Function", "Invalid event object to dispatch! Misses setTarget() method!");
          core.Assert.isType(eventObject.setCurrentTarget, "Function", "Invalid event object to dispatch! Misses setCurrentTarget() method!");
          core.Assert.isType(eventObject.setEventPhase, "Function", "Invalid event object to dispatch! Misses setEventPhase() method!");

          core.Assert.isType(eventType, "String", "Invalid event type to dispatch!");
          core.Assert.isNotEmpty(eventType, "Invalid event type to dispatch!");
        }

        eventObject.setTarget(eventTarget);

        // Event Phases:
        // - CAPTURING_PHASE = 1
        // - AT_TARGET = 2
        // - BUBBLING_PHASE = 3
        eventObject.setEventPhase(1);

        var targets = getTargets(eventTarget);
        var targetsLength = targets.length;
        var canBubble = targetsLength > 1;
        var dispatched = false;

        for (var targetIndex=0; targetIndex<targetsLength; targetIndex++)
        {
          var currentTarget = targets[targetIndex];
          var atTarget = currentTarget === eventTarget;

          var handlers = getHandlers(currentTarget, eventType);
          var handlersLength = handlers.length;
          if (handlersLength > 0)
          {
            dispatched = true;

            // Update event object to current target
            eventObject.setCurrentTarget(currentTarget);

            // Transition to at-target
            if (atTarget) {
              eventObject.setEventPhase(2);
            }

            // Work on copy of handlers to ignore changes during execution of handlers
            handlers = slice.call(handlers);

            // Process handlers in order of being registered
            for (var handlerIndex=0; handlerIndex<handlersLength; handlerIndex++) {
              handlers[handlerIndex].call(currentTarget, eventObject);
            }

            // Don't process remaining targets if propagation was stopped from any handler
            if (eventObject.isPropagationStopped()) {
              break;
            }
          }

          // Transition to bubble phase
          if (atTarget) {
            eventObject.setEventPhase(3);
          }
        }

        eventObject.setTarget(null);

        if (dispatched)
        {
          eventObject.setCurrentTarget(null);

          if (stopped) {
            eventObject.resetPropagationStopped();
          }
        }

        return dispatched;
      },


      /**
       * {Boolean} Shorthand for firing automatically pooled instances of {core.event.Simple}
       * with the given @type {String}, @data {var} and @message {String}.
       * The method returns whether any listers were processed.
       */
      fireEvent : function(type, data, message) 
      {
        var eventObject = core.event.Simple.obtain(type, data, message);
        var retval = this.dispatchEvent(eventObject);
        eventObject.release();

        return retval;
      },


      /**
       * Returns the event parent of this object for bubbling.
       */
      getEventParent : function() {
        return null;
      }
    }
  });

})();
