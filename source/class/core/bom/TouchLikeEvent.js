/* 
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of Microsoft Corporation
  Hand.js v1.0.13, Wed Jul 10, 2013 at 9:00 AM
  http://handjs.codeplex.com
  Apache License 2.0
==================================================================================================
*/

(function(document, Object, undefined)
{
  var POINTER_TYPE_TOUCH = "touch";
  var POINTER_TYPE_PEN = "pen";
  var POINTER_TYPE_MOUSE = "mouse";

  /**
   * Helper to create and fire touch like native event objects
   */
  core.Module("core.bom.TouchLikeEvent",
  {
    /**
     * Creates and dispatches a new event based on @sourceEvent {Event}. Applies the @newName {String} as
     * the new event name.
     */
    create : function(sourceEvent, newName) 
    {
      // Considering touch events are almost like super mouse events
      var evObj;

      if (document.createEvent) 
      {
        evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent(newName, true, true, window, 1, sourceEvent.screenX, sourceEvent.screenY,
          sourceEvent.clientX, sourceEvent.clientY, sourceEvent.ctrlKey, sourceEvent.altKey,
          sourceEvent.shiftKey, sourceEvent.metaKey, sourceEvent.button, null);
      }
      else 
      {
        evObj = document.createEventObject();
        evObj.screenX = sourceEvent.screenX;
        evObj.screenY = sourceEvent.screenY;
        evObj.clientX = sourceEvent.clientX;
        evObj.clientY = sourceEvent.clientY;
        evObj.ctrlKey = sourceEvent.ctrlKey;
        evObj.altKey = sourceEvent.altKey;
        evObj.shiftKey = sourceEvent.shiftKey;
        evObj.metaKey = sourceEvent.metaKey;
        evObj.button = sourceEvent.button;
      }

      // offsets
      if (evObj.offsetX === undefined) 
      {
        if (sourceEvent.offsetX !== undefined) 
        {
          // For Opera which creates readonly properties
          if (Object && Object.defineProperty !== undefined) 
          {
            Object.defineProperty(evObj, "offsetX", {
              writable: true
            });

            Object.defineProperty(evObj, "offsetY", {
              writable: true
            });
          }

          evObj.offsetX = sourceEvent.offsetX;
          evObj.offsetY = sourceEvent.offsetY;
        }
        else if (sourceEvent.layerX !== undefined) 
        {
          evObj.offsetX = sourceEvent.layerX - sourceEvent.currentTarget.offsetLeft;
          evObj.offsetY = sourceEvent.layerY - sourceEvent.currentTarget.offsetTop;
        }
      }

      // adding missing properties
      if (sourceEvent.isPrimary !== undefined) {
        evObj.isPrimary = sourceEvent.isPrimary;
      } else {
        evObj.isPrimary = true;
      }
      
      if (sourceEvent.pressure) {
        evObj.pressure = sourceEvent.pressure;
      } 
      else 
      {
        var button = 0;

        if (sourceEvent.which !== undefined)
          button = sourceEvent.which;
        else if (sourceEvent.button !== undefined) {
          button = sourceEvent.button;
        }

        evObj.pressure = (button == 0) ? 0 : 0.5;
      }

      // Rotation
      if (sourceEvent.rotation) {
        evObj.rotation = sourceEvent.rotation;
      } else {
        evObj.rotation = 0;
      }

      // Timestamp
      if (sourceEvent.hwTimestamp) {
        evObj.hwTimestamp = sourceEvent.hwTimestamp;
      } else {
        evObj.hwTimestamp = 0;
      }

      // Tilts
      if (sourceEvent.tiltX) {
        evObj.tiltX = sourceEvent.tiltX;
      } else {
        evObj.tiltX = 0;
      }

      if (sourceEvent.tiltY) {
        evObj.tiltY = sourceEvent.tiltY;
      } else {
        evObj.tiltY = 0;
      }

      // Width and Height
      if (sourceEvent.height) {
        evObj.height = sourceEvent.height;
      } else {
        evObj.height = 0;
      }
        
      if (sourceEvent.width) {
        evObj.width = sourceEvent.width;
      } else {
        evObj.width = 0;
      }
        
      // preventDefault
      evObj.preventDefault = function() 
      {
        if (sourceEvent.preventDefault !== undefined) {
          sourceEvent.preventDefault();
        }
      };

      // stopPropagation
      if (evObj.stopPropagation !== undefined) 
      {
        var current = evObj.stopPropagation;

        evObj.stopPropagation = function() 
        {
          if (sourceEvent.stopPropagation !== undefined) {
            sourceEvent.stopPropagation();
          }
            
          current.call(this);
        };
      }

      // Constants
      evObj.POINTER_TYPE_TOUCH = POINTER_TYPE_TOUCH;
      evObj.POINTER_TYPE_PEN = POINTER_TYPE_PEN;
      evObj.POINTER_TYPE_MOUSE = POINTER_TYPE_MOUSE;

      // Pointer values
      evObj.pointerId = sourceEvent.pointerId;
      evObj.pointerType = sourceEvent.pointerType;

      // Old spec version check
      switch (evObj.pointerType) 
      {
        case 2:
          evObj.pointerType = evObj.POINTER_TYPE_TOUCH;
          break;
      
        case 3:
          evObj.pointerType = evObj.POINTER_TYPE_PEN;
          break;
      
        case 4:
          evObj.pointerType = evObj.POINTER_TYPE_MOUSE;
          break;
      }

      // Fire event
      if (sourceEvent.target) 
      {
        sourceEvent.target.dispatchEvent(evObj);
      }
      else
      {
        // We must fallback to mouse event for very old browsers
        sourceEvent.srcElement.fireEvent("on" + getMouseEquivalentEventName(newName), evObj);
      }
    }
  });

})(document, Object);

