/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 *
 */
core.Class("core.bom.event.type.Pointer",
{
  pooling : true,

  construct : function(nativeEvent, eventType)
  {
    // We use the touchpoint for touch events
    var isMouse = nativeEvent.type != null ? true : false;

    this.__nativeEvent = nativeEvent;
    this.__propagationStopped = this.__defaultPrevented = false;

    this.type = eventType;
    this.target = nativeEvent.target;
    this.offsetX = isMouse ? nativeEvent.offsetX : nativeEvent.pageX;
    this.offsetY = isMouse ? nativeEvent.offsetY : nativeEvent.pageY;
    this.isPrimary = isMouse;

    this.screenX = nativeEvent.screenX;
    this.screenY = nativeEvent.screenY;
    this.clientX = nativeEvent.clientX;
    this.clientY = nativeEvent.clientY;

    if (isMouse)
    {
      this.ctrlKey = nativeEvent.ctrlKey;
      this.altKey = nativeEvent.altKey;
      this.shiftKey = nativeEvent.shiftKey;
      this.metaKey = nativeEvent.metaKey;
      this.button = nativeEvent.button;
    }
    else
    {
      this.ctrlKey = this.altKey = this.shiftKey = this.metaKey = this.button = null;
    }

    // Pressure
    if (nativeEvent.pressure)
    {
      this.pressure = nativeEvent.pressure;
    }
    else
    {
      var button = 0;
      if (nativeEvent.which != null) {
        button = nativeEvent.which;
      } else if (nativeEvent.button != null) {
        button = nativeEvent.button;
      }

      this.pressure = button == 0 ? 0 : 0.5;
    }

    // Just to not override mouse id
    this.pointerId = isMouse ? 1 : 2 + nativeEvent.identifier;
    this.pointerType = isMouse ? "mouse" : "touch";
  },

  members :
  {
    type : null,
    offsetX : 0,
    offsetY : 0,
    target : 0,
    isPrimary : true,
    pointerId : 0,
    pointerType : "mouse",

    __nativeEvent : null,
    __propagationStopped : false,
    __defaultPrevented : false,

    reflectState : function()
    {
      var nat = this.__nativeEvent;

      if (nat)
      {
        if (this.__propagationStopped) {
          nat.stopPropagation();
        }

        if (this.__defaultPrevented) {
          nat.preventDefault();
        }
      }
    },


    preventDefault : function() {
      this.__defaultPrevented = true;
    },

    isDefaultPrevented : function() {
      return this.__defaultPrevented;
    },

    stopPropagation : function() {
      this.__propagationStopped = true;
    },

    isPropagationStopped : function() {
      return this.__propagationStopped;
    }
  }
});
