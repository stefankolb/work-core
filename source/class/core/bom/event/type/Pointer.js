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
    if (sourceEvent.pressure) 
    {
      this.pressure = sourceEvent.pressure;
    }
    else 
    {
      var button = 0;
      if (sourceEvent.which != null) {
        button = sourceEvent.which;
      } else if (sourceEvent.button != null) {
        button = sourceEvent.button;
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


  }
});
