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
        console.log("Add native: " + nativeType + " to " + target);
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



  core.Module("core.bom.PointerEventsNext",
  {
    has : function(target, type, callback, context, capture)
    {
      var specialHandler = special[type];
      if (specialHandler) {
        return specialHandler.remove(target, type, callback, context, capture);
      }

      // Hard-wire context to function, re-use existing bound functions
      if (context) {
        callback = core.Function.bind(callback, context);
      }

      // Check for listener existance
      var eventId = core.bom.event.Util.getId(type, callback, capture);
      return !!target[eventId];
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

      // Lookup entry
      var eventId = core.bom.event.Util.getId(type, callback, capture);
      console.log("ADD: " + eventId)
      var listeners = core.bom.event.Util.create(target, eventId);

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

      // Registering all native listeners
      core.bom.event.Util.addNative(target, eventId, capture);
    },

    remove : function(target, type, callback, context, capture)
    {
      var specialHandler = special[type];
      if (specialHandler) {
        return specialHandler.remove(target, type, callback, context, capture);
      }

      // Hard-wire context to function, re-use existing bound functions
      if (context) {
        callback = core.Function.bind(callback, context);
      }
      
      // Unregistering all native listeners
      var eventId = core.bom.event.Util.getId(type, callback, capture);
      core.bom.event.Util.removeNative(target, eventId, capture);
    }
  });



})(document);






