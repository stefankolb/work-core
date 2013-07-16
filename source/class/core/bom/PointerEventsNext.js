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



  var eventCallback = function()
  {




  };



  core.Module("core.bom.PointerEventsNext",
  {
    add : function(target, type, callback, context, capture) 
    {
      if (context != null) {
        callback = core.Function.bind(callback, context);
      }

      var pointerType = "pointer" + type;

      if (useTouch)
      {

      }

      if (useMouse)
      {
        var mouseType = "mouse" + type;
        if (hasMouseEnterLeave && (mouseType == "mouseenter" || mouseType == "mouseleave")) {
          mouseType = (mouseType == "mouseenter") ? "mouseover" : "mouseout";
        }

        console.log("Register: " + mouseType + " to proxy event " + pointerType + "...");






        var localCallback = function(nativeEvent)
        {
          console.log("Executed: " + nativeEvent.type + " for " + pointerType)
          
          var eventObj = core.bom.event.Pointer.obtain(nativeEvent, pointerType);


          callback(eventObj);

          eventObj.release();

        };

        target.addEventListener(mouseType, localCallback, capture);
      }

      
    },

    remove : function(target, type, callback, context, capture)
    {
      if (context != null) {
        callback = core.Function.bind(callback, context);
      }

      //target.removeEventListener(type, callback, capture);
    }
  });



})(document);






