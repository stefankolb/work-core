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
    this.isPrimary = isMouse || true;

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
