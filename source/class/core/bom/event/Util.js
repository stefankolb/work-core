/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * #break(core.bom.PointerEventsNext)
 */
core.Module("core.bom.event.Util",
{
  getId : function(type, callback, capture) 
  {  
    var id = "$$ev-" + type + "-" + core.util.Id.get(callback);
    if (capture === true) {
      id += "-capture";
    }

    return id;
  },

  create : function(target, eventId)
  {
    if (target[eventId]) {
      throw new Error("Could not add the same listener two times!");
    }

    // Create listener database
    var listeners = target[eventId] = {};
    return listeners;
  },

  addNative : function(target, eventId, capture)
  {
    var listeners = target[eventId];
    if (!listeners) {
      return;
    }

    for (var nativeType in listeners) {
      target.addEventListener(nativeType, listeners[nativeType], capture);
    }
  },

  removeNative : function(target, eventId, capture)
  {
    var listeners = target[eventId];
    if (!listeners) {
      return;
    }

    for (var nativeType in listeners) {
      target.removeEventListener(nativeType, listeners[nativeType], capture);
    }

    // Cheap cleanup
    target[eventId] = null;
  },

  addPointer : function(target, eventId, capture)
  {
    var listeners = target[eventId];
    if (!listeners) {
      return;
    }

    for (var pointerType in listeners) {
      core.bom.PointerEventsNext.add(target, pointerType, listeners[pointerType], null, capture);
    }
  },

  removePointer : function(target, eventId, capture)
  {
    var listeners = target[eventId];
    if (!listeners) {
      return;
    }

    for (var pointerType in listeners) {
      core.bom.PointerEventsNext.remove(target, pointerType, listeners[pointerType], null, capture);
    }

    // Cheap cleanup
    target[eventId] = null;
  }    
});
