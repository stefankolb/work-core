/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Tools for native event handling
 */
core.Module("core.event.Native",
{
  fireElementEvent : function(element, event)
  {
    if (document.createEventObject)
    {
      // Dispatch for IE
      var evt = document.createEventObject();
      return element.fireEvent('on'+event,evt)
    }
    else
    {
      // Dispatch for standard
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent(event, true, true ); // event type,bubbling,cancelable
      return !element.dispatchEvent(evt);
    }
  }
});
