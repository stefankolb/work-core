/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Utilities for event management.
 *
 * #break(core.bom.PointerEvent)
 */
core.Module("core.bom.event.Util",
{
  /**
   * {String} Returns a unique event ID useful for storing native listeners on the target itself for
   * easier management as the DOM do not offer any `hasEventListener` call or any useful
   * access to the list of current event listeners. Just pass the event @type {String}
   * (of your own naming, not DOM), the @callback {Function} (already bound to context) and
   * the @capture {Boolean?false} flag to control the event phase.
   */
  getId : function(type, callback, capture)
  {
    var id = "$$ev-" + type + "-" + core.util.Id.get(callback);
    if (capture === true) {
      id += "-capture";
    }

    return id;
  },


  /**
   * {Map} Creates a event listener database on the given @target {Object} under
   * the given @eventId {String} as created by {#getId}. Returns a map where
   * the actual native event types are mapped with their individual listeners.
   */
  create : function(target, eventId)
  {
    if (target[eventId]) {
      throw new Error("Could not add the same listener two times!");
    }

    // Create listener database
    var listeners = target[eventId] = {};
    return listeners;
  },


  /**
   * Adds native event listeners to the given @target {Object} based on the
   * listeners stored in the target's listener database under the given @eventId {String}.
   * To enable listening in the capture phase set @capture {Boolean?false} to `true`.
   */
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


  /**
   * Removes native event listeners from the given @target {Object} based on the
   * listeners stored in the target's listener database under the given @eventId {String}.
   * To remove the listeners from the capture phase set @capture {Boolean?false} to `true`.
   * Automatically cleans up the database entry so that memory bound by the listener
   * functions is made available on the next GC run.
   */
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


  /**
   * Adds pointer event listeners to the given @target {Object} based on the
   * listeners stored in the target's listener database under the given @eventId {String}.
   * To enable listening in the capture phase set @capture {Boolean?false} to `true`.
   */
  addPointer : function(target, eventId, capture)
  {
    var listeners = target[eventId];
    if (!listeners) {
      return;
    }

    for (var pointerType in listeners) {
      core.bom.PointerEvent.add(target, pointerType, listeners[pointerType], null, capture);
    }
  },


  /**
   * Removes pointer event listeners from the given @target {Object} based on the
   * listeners stored in the target's listener database under the given @eventId {String}.
   * To remove the listeners from the capture phase set @capture {Boolean?false} to `true`.
   * Automatically cleans up the database entry so that memory bound by the listener
   * functions is made available on the next GC run.
   */
  removePointer : function(target, eventId, capture)
  {
    var listeners = target[eventId];
    if (!listeners) {
      return;
    }

    for (var pointerType in listeners) {
      core.bom.PointerEvent.remove(target, pointerType, listeners[pointerType], null, capture);
    }

    // Cheap cleanup
    target[eventId] = null;
  }
});
