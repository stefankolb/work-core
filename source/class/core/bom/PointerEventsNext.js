/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function(document, undefined)
{
  var usePointer = document.onpointerdown !== undefined || document.onmspointerdown !== undefined;
  var useTouch = document.ontouchstart !== undefined;
  var useMouse = document.documentElement.onmousedown !== undefined
  console.log("Use: ", "Pointer=" + usePointer, "Touch=" + useTouch, "Mouse=" + useMouse);

  var hasMouseEnterLeave = document.onmouseenter || document.onmouseleave;
  console.log("Has: ", "MouseEventLeave=" + hasMouseEnterLeave);


  var special = {
    tap : core.bom.TapEvent
  }


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

  core.Module("core.bom.PointerEventsNext",
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

      // Mouse support
      if (useMouse)
      {
        var nativeType = "mouse" + type;
        if (hasMouseEnterLeave && (nativeType == "mouseenter" || nativeType == "mouseleave")) {
          nativeType = nativeType == "mouseenter" ? "mouseover" : "mouseout";
        }

        listeners[nativeType] = function(nativeEvent)
        {
          var eventObject = core.bom.event.type.Pointer.obtain(nativeEvent, pointerType);
          callback(eventObject);
          eventObject.release();
        };
      }

      if (useTouch)
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
          var changedTouches = nativeEvent.changedTouches;
          for (var i=0, l=changedTouches.length; i<l; i++)
          {
            var touchPoint = changedTouches[i];
            var eventObject = core.bom.event.type.Pointer.obtain(touchPoint, pointerType);
            console.log("Firing: " + pointerType + " on " + target, eventObject, touchPoint);
            callback(eventObject);
            eventObject.release();
          }
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






