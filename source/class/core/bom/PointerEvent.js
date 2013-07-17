/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function(document, undefined)
{
  var hasPointerEvents = document.onpointerdown !== undefined || document.onmspointerdown !== undefined;
  var hasTouchEvents = document.ontouchstart !== undefined;
  var hasMouseEvents = !hasPointerEvents && !hasTouchEvents;
  var hasMouseEnterLeaveEvents = document.onmouseenter || document.onmouseleave;

  var special = {
    tap : core.bom.TapEvent
  }

  /** {=Map} Map of all event types supported */
  var supportedPointerEvents = core.Array.toKeys([
    "down", "up", "move", "over", "out", "cancel", "enter", "leave"
  ], true);

  if (jasy.Env.isSet("debug"))
  {
    var checkSignature = function(target, type, callback, context, capture) 
    {
      if (target == null) {
        throw new Error("Invalid targrt");
      }

      core.Assert.isType(type, "String");

      if (!supportedPointerEvents[type]) {
        throw new Error("Unsupported event: " + type);
      }

      core.Assert.isType(callback, "Function");

      if (context != null) {
        core.Assert.isType(context, "String");  
      }

      if (capture != null) {
        core.Assert.isType(capture, "Boolean");  
      }
    };    
  }

  /**
   * Pointer Events API for dealing with down/up/move events.
   *
   * Still work in progress.
   */
  core.Module("core.bom.PointerEvent",
  {
    has : function(target, type, callback, context, capture)
    {
      var specialHandler = special[type];
      if (specialHandler) {
        return specialHandler.remove(target, type, callback, context, capture);
      }

      // Input parameter validation
      if (jasy.Env.isSet("debug")) {
        checkSignature(target, type, callback, context, capture);
      }

      // Hard-wire context to function, re-use existing bound functions
      if (context) {
        callback = core.Function.bind(callback, context);
      }

      // Check for listener existance
      var eventId = core.bom.event.Util.getId(type, callback, capture);
      return !!target[eventId];
    },


    add : function(target, type, callback, context, capture) 
    {
      var specialHandler = special[type];
      if (specialHandler) {
        return specialHandler.add(target, type, callback, context, capture);
      }

      // Input parameter validation
      if (jasy.Env.isSet("debug")) {
        checkSignature(target, type, callback, context, capture);
      }

      // Hard-wire context to function, re-use existing bound functions
      if (context) {
        callback = core.Function.bind(callback, context);
      }

      // Lookup entry
      var eventId = core.bom.event.Util.getId(type, callback, capture);
      var listeners = core.bom.event.Util.create(target, eventId);

      // Full event name to fire
      var pointerType = "pointer" + type;



      if (hasTouchEvents)
      {
        var db = target["$$ev-touch"];
        if (db)
        {
          console.log("Reuse existing event handlers...");
          db.push({type : type, callback : callback});
          return;
        }

        // Initialize
        db = target["$$ev-touch"] = [
          {type : type, callback : callback}
        ];

        // Primary
        var primaryIdentifier = null;

        var previousTargets = {};

        // Touch Identifier:
        // An identification number for each touch point. When a touch point becomes active, it must be assigned an 
        // identifier that is distinct from any other active touch point. While the touch point remains active, all 
        // events that refer to it must assign it the same identifier.

        listeners.touchstart = function(nativeEvent)
        {
          var changed = nativeEvent.changedTouches;
          var all = nativeEvent.touches;

          if (changed.length == 1 && all.length == 1) {
            primaryIdentifier = changed[0].identifier;
          }

          for (var i=0, il=changed.length; i<il; i++)
          {
            var point = changed[i];          
            var currentTarget = previousTargets[point.identifier] = point.target;

            console.log("Fire pointerdown: primary=" + (point.identifier == primaryIdentifier), point.target);

            var eventObject = core.bom.event.type.Pointer.obtain(point, "pointerdown");
            eventObject.isPrimary = point.identifier == primaryIdentifier;
            eventObject.currentTarget = currentTarget;

            for (var j=0, jl=db.length; j<jl; j++)
            {
              var entry = db[j];
              if (entry.type == "down") {
                entry.callback(eventObject);
              }
            }

            eventObject.release();
          }
        };

        listeners.touchmove = function(nativeEvent)
        {
          var changed = nativeEvent.changedTouches;
          for (var i=0, il=changed.length; i<il; i++)
          {
            var point = changed[i];

            var moveTarget = document.elementFromPoint(point.clientX, point.clientY);
            console.log("Fire pointermove: primary=" + (point.identifier == primaryIdentifier), point.target);


            if (point.target != moveTarget) {
              console.log("Moved to: " + moveTarget);
            }



            var eventObject = core.bom.event.type.Pointer.obtain(point, "pointermove");
            eventObject.isPrimary = point.identifier == primaryIdentifier;
            eventObject.target = eventObject.currentTarget = previousTargets[point.identifier];

            for (var j=0, jl=db.length; j<jl; j++)
            {
              var entry = db[j];
              if (entry.type == "move") {
                entry.callback(eventObject);
              }
            }

            eventObject.release();
          }
        };

        listeners.touchend = function(nativeEvent)
        {
          var changed = nativeEvent.changedTouches;
          for (var i=0, il=changed.length; i<il; i++)
          {
            var point = changed[i];

            console.log("Fire pointerup: primary=" + (point.identifier == primaryIdentifier), point.target);

            var eventObject = core.bom.event.type.Pointer.obtain(point, "pointerup");
            eventObject.isPrimary = point.identifier == primaryIdentifier;
            eventObject.target = eventObject.currentTarget = previousTargets[point.identifier];

            for (var j=0, jl=db.length; j<jl; j++)
            {
              var entry = db[j];
              if (entry.type == "up") {
                entry.callback(eventObject);
              }
            }

            eventObject.release();

            // Reset primary
            if (point.identifier == primaryIdentifier) {
              primaryIdentifier = null;
            }
          }
        };

        listeners.touchcancel = function(nativeEvent)
        {
          var changed = nativeEvent.changedTouches;
          for (var i=0, il=changed.length; i<il; i++)
          {
            var point = changed[i];

            console.log("Fire pointercancel: primary=" + (point.identifier == primaryIdentifier), point.target);

            var eventObject = core.bom.event.type.Pointer.obtain(point, "pointercancel");
            eventObject.isPrimary = point.identifier == primaryIdentifier;

            for (var j=0, jl=db.length; j<jl; j++)
            {
              var entry = db[j];
              if (entry.type == "cancel") {
                entry.callback(eventObject);
              }
            }

            eventObject.release();

            // Reset primary
            if (point.identifier == primaryIdentifier) {
              primaryIdentifier = null;
            }
          }
        };




      }


      // Touch support
      if (false && hasTouchEvents)
      {
        if (type == "down") {
          var nativeType = "touchstart";
        } else if (type == "move") {
          var nativeType = "touchmove";
        } else if (type == "up") {
          var nativeType = "touchend";
        }

        listeners[nativeType] = function(nativeEvent)
        {
          var touches = nativeEvent.touches;
          var changedTouches = nativeEvent.changedTouches;

          for (var i=0, l=changedTouches.length; i<l; i++)
          {
            var touchPoint = changedTouches[i];
            var eventObject = core.bom.event.type.Pointer.obtain(touchPoint, pointerType);

            // Maybe that solution is too easy... let's see
            eventObject.isPrimary = touches.length < 2;

            callback(eventObject);
            eventObject.release();
          }
        };
      }

      // Mouse support
      else if (hasMouseEvents)
      {
        var nativeType = "mouse" + type;
        if (hasMouseEnterLeaveEvents && (nativeType == "mouseenter" || nativeType == "mouseleave")) {
          nativeType = nativeType == "mouseenter" ? "mouseover" : "mouseout";
        }

        listeners[nativeType] = function(nativeEvent)
        {
          var eventObject = core.bom.event.type.Pointer.obtain(nativeEvent, pointerType);
          callback(eventObject);
          eventObject.release();
        };
      }



      // Registering all native listeners
      core.bom.event.Util.addNative(target, eventId, capture);
    },

    remove : function(target, type, callback, context, capture)
    {
      var specialHandler = special[type];
      if (specialHandler) {
        return specialHandler.remove(target, type, callback, context, capture);
      }

      // Input parameter validation
      if (jasy.Env.isSet("debug")) {
        checkSignature(target, type, callback, context, capture);
      }

      // Hard-wire context to function, re-use existing bound functions
      if (context) {
        callback = core.Function.bind(callback, context);
      }
      
      // Unregistering all native listeners
      var eventId = core.bom.event.Util.getId(type, callback, capture);
      core.bom.event.Util.removeNative(target, eventId, capture);
    }
  });



})(document);






