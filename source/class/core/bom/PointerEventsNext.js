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
      var eventKey = "$$ev-" + type + "-" + capture + "-" + core.util.Id.get(callback);
      var db = target[eventKey];
      if (db) 
      {
        console.error("Ooops, re-adding same callback in same context for same type on same target?");
        return;
      }

      db = target[eventKey] = {};

      if (useMouse)
      {
        var pointerType = "pointer" + type;

        var nativeType = "mouse" + type;
        if (hasMouseEnterLeave && (nativeType == "mouseenter" || nativeType == "mouseleave")) {
          nativeType = nativeType == "mouseenter" ? "mouseover" : "mouseout";
        }

        var mouseHandler = function(nativeEvent)
        {
          var eventObject = core.bom.event.Pointer.obtain(nativeEvent, pointerType);
          callback(eventObject);
          eventObject.release();
        };

        db[nativeType] = mouseHandler;
        target.addEventListener(nativeType, mouseHandler, capture);

      }


      
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
      var eventKey = "$$ev-" + type + "-" + capture + "-" + core.util.Id.get(callback);
      console.log("REMOVE-EVENT-KEY: " + eventKey)
      var db = target[eventKey];
      if (!db) 
      {
        console.error("No such listener: " + type + " on " + target);
        return;
      }
      
      for (var nativeType in db) {
        target.removeEventListener(nativeType, callback, capture);
      }

      // Cheap cleanup
      target[eventKey] = null;

      

    }
  });



})(document);






