(function() 
{
  var getHandlers = function(object, type) 
  {
    var events = object.__events || (object.__events = {});
    return events[type] || (events[type] = []);
  };

  var slice = Array.prototype.slice;


  /**
   * Generic event interface for Core classes.
   */
  core.Class("core.event.MEvent", 
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
        if (jasy.Env.isSet("debug")) 
        {
          core.Assert.isType(eventObject, "Object", "Invalid event type to dispatch!");
          core.Assert.isType(eventObject.type, "String", "Invalid event type to dispatch!");
          core.Assert.isNotEmpty(eventObject.type, "Invalid event type to dispatch!");
        }

        var self = this;
        var handlers = slice.call(getHandlers(self, eventObject.type));
        var length = handlers.length;

        for (var i=0; i<length; ++i) {
          handlers[i].call(self, eventObject);
        }

        return !!length;
      },


      /**
       * Fires a simple notification like event without creating any object
       * or additional data at all. For most cases prefer using {#dispatchEvent}
       * instead. The method returns whether any listers were processed.
       */
      fireEvent : function(type) 
      {
        if (jasy.Env.isSet("debug")) 
        {
          core.Assert.isType(type, "String", "Invalid event type to dispatch!");
          core.Assert.isNotEmpty(type, "Invalid event type to dispatch!");
        }

        var self = this;
        var handlers = slice.call(getHandlers(self, type));
        var length = handlers.length;

        for (var i=0; i<length; ++i) {
          handlers[i].call(self);
        }

        return !!length;
      }
    }

  });

})();
