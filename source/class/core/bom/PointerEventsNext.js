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
      var id = type + "-" + core.util.Id.get(callback);
      if (capture == true) {
        id += "-capture";
      }
      return id;
    }
  });

  var getEventId = core.bom.event.Util.getId;



  core.Module("core.bom.PointerEventsNext",
  {
    has : function(target, type, callback, context, capture)
    {
      // Hard-wire context to function, re-use existing bound functions
      if (context) {
        callback = core.Function.bind(callback, context);
      }

      if (useTouch)
      {
        var eventId = getEventId("touch", type, callback, capture);
        return !!target[eventId];
      }

      if (useMouse)
      {
        var eventId = getEventId("mouse", type, callback, capture);
        return !!target[eventId];
      }

      return false;
    },


    add : function(target, type, callback, context, capture) 
    {
      // Hard-wire context to function, re-use existing bound functions
      if (context) {
        callback = core.Function.bind(callback, context);
      }

      var specialHandler = special[type];
      if (specialHandler) {
        return specialHandler.add(target, type, callback, capture);
      }

      var pointerType = "pointer" + type;

      if (useTouch)
      {

      }

      if (useMouse)
      {
        var eventId = "mouse-" + getEventId(type, callback, capture);

        var nativeType = "mouse" + type;
        if (hasMouseEnterLeave && (nativeType == "mouseenter" || nativeType == "mouseleave")) {
          nativeType = nativeType == "mouseenter" ? "mouseover" : "mouseout";
        }

        var wrapper = target[eventId];
        if (wrapper) {
          return;
        }

        var wrapper = target[eventId] = function(nativeEvent)
        {
          console.log("Execute wrapper for: " + eventId);
          var eventObj = core.bom.event.Pointer.obtain(nativeEvent, pointerType);
          callback(eventObj);
          eventObj.release();
        };

        target.addEventListener(nativeType, wrapper, capture);
      }
    },

    remove : function(target, type, callback, context, capture)
    {
      if (context != null) {
        callback = core.Function.bind(callback, context);
      }

      if (capture == null) {
        capture = false;
      }

      var pointerType = "pointer" + type;
      

      if (useTouch)
      {

      }

      if (useMouse)
      {
        var eventId = "mouse-" + getEventId(type, callback, capture);

        var nativeType = "mouse" + type;
        if (hasMouseEnterLeave && (nativeType == "mouseenter" || nativeType == "mouseleave")) {
          nativeType = nativeType == "mouseenter" ? "mouseover" : "mouseout";
        }

        var wrapper = target[eventId];
        if (wrapper) {
          target.removeEventListener(nativeType, wrapper, capture);
        }
        
      }      

      

    }
  });



})(document);






