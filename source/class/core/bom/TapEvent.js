/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function() 
{
  var maxClickMovement = 5;

  /**
   * #break(core.bom.PointerEventsNext)
   */
  core.Module("core.bom.TapEvent",
  {
    add : function(target, type, callback, context, capture)
    {
      // Hard-wire context to function, re-use existing bound functions
      if (context) {
        callback = core.Function.bind(callback, context);
      }

      var eventId = core.bom.event.Util.getId(type, callback, capture);
      var listeners = core.bom.event.Util.create(target, eventId);

      var downOn = null;
      var downX = -1000;
      var downY = -1000;

      listeners.down = function(e) 
      {
        if (!e.isPrimary) {
          return;
        }

        downOn = e.target;
        downX = e.offsetX;
        downY = e.offsetY;
      };

      listeners.up = function(e) 
      {
        if (!e.isPrimary) {
          return;
        }

        if (e.target == downOn && Math.abs(downX - e.offsetX) < maxClickMovement && Math.abs(downY - e.offsetY) < maxClickMovement) 
        {
          var eventObj = core.bom.event.type.Pointer.obtain(e, "tap");
          callback(eventObj);
          eventObj.release();
        }

        // Garbage collection
        downOn = null;
      };  

      core.bom.event.Util.addPointer(target, eventId, capture);
    },

    remove : function(target, type, callback, context, capture)
    {
      if (context != null) {
        callback = core.Function.bind(callback, context);
      }

      var eventId = core.bom.event.Util.getId(type, callback, capture);
      core.bom.event.Util.removePointer(target, eventId, capture);
    }
  });

})();

