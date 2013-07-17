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
    this.__nativeEvent = nativeEvent;
    this.type = eventType;

    this.target = nativeEvent.target;
    this.offsetX = nativeEvent.offsetX;
    this.offsetY = nativeEvent.offsetY;
    this.isPrimary = nativeEvent.type.slice(0, 5) == "mouse";

  },

  members :
  {
    type : null,
    offsetX : 0,
    offsetY : 0,
    target : 0,
    isPrimary : true

  }
});
