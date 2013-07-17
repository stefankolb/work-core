(function(document, undefined)
{
  var usePointer = document.onpointerdown !== undefined || document.onmspointerdown !== undefined;
  var useTouch = document.ontouchstart !== undefined;
  var useMouse = document.documentElement.onmousedown !== undefined
  console.log("Use: ", "Pointer=" + usePointer, "Touch=" + useTouch, "Mouse=" + useMouse);

  var hasMouseEnterLeave = document.onmouseenter || document.onmouseleave;
  console.log("Has: ", "MouseEventLeave=" + hasMouseEnterLeave);





  core.Class("core.bom.event.Pointer",
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


  var special = {
    tap : core.bom.TapEvent
  }



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

    add : function(target, eventKey, capture)
    {
      var listeners = target[eventKey];
      if (!listeners) {
        return;
      }

      for (var nativeType in listeners) {
        target.addEventListener(nativeType, listeners[nativeType], capture);
      }
    },

    remove : function(target, eventKey, capture)
    {
      var listeners = target[eventKey];
      if (!listeners) {
        return;
      }

      for (var nativeType in listeners) {
        target.removeEventListener(nativeType, listeners[nativeType], capture);
      }

      // Cheap cleanup
      target[eventKey] = null;
    }
  });



  core.Module("core.bom.PointerEventsNext",
  {
    has : function(target, type, callback, context, capture)
    {

    },


    add : function(target, type, callback, context, capture) 
    {
      var specialHandler = special[type];
      if (specialHandler) {
        return specialHandler.add(target, type, callback, context, capture);
      }

      // Hard-wire context to function, re-use existing bound functions
      if (context) {
        callback = core.Function.bind(callback, context);
      }

      // Normalize capture flag
      if (capture !== true) {
        capture = false;
      }

      // Lookup entry
      var eventKey = core.bom.event.Util.getId(type, callback, capture);
      var listeners = target[eventKey];
      if (listeners) 
      {
        console.error("Could not add the same listener two times!");
        return;
      }

      // Create listener database
      listeners = target[eventKey] = {};

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
          var eventObject = core.bom.event.Pointer.obtain(nativeEvent, pointerType);
          callback(eventObject);
          eventObject.release();
        };
      }


      // Registering all events
      core.bom.event.Util.add(target, eventKey, capture);

      
    },

    remove : function(target, type, callback, context, capture)
    {
      var specialHandler = special[type];
      if (specialHandler) {
        return specialHandler.add(target, type, callback, context, capture);
      }

      // Hard-wire context to function, re-use existing bound functions
      if (context) {
        callback = core.Function.bind(callback, context);
      }

      // Normalize capture flag
      if (capture !== true) {
        capture = false;
      }

      // Lookup entry
      var eventKey = core.bom.event.Util.getId(type, callback, capture);
      
      // Unregistering all events
      core.bom.event.Util.remove(target, eventKey, capture);
    }
  });



})(document);






