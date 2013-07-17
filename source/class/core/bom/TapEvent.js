(function() 
{
  var downOn = null;
  var downX = -1000;
  var downY = -1000;
  var maxClickMovement = 5;

  /**
   * #break(core.bom.PointerEventsNext)
   */
  core.Module("core.bom.TapEvent",
  {
    add : function(target, type, callback, capture)
    {
      var eventId = core.bom.event.Util.getId(type, callback, capture);
      if (target[eventId]) {
        return;
      }

      var down = function(e) 
      {
        if (!e.isPrimary) {
          return;
        }

        downOn = e.target;
        downX = e.offsetX;
        downY = e.offsetY;
      };

      var up = function(e) 
      {
        if (!e.isPrimary) {
          return;
        }

        if (e.target == downOn && Math.abs(downX - e.offsetX) < maxClickMovement && Math.abs(downY - e.offsetY) < maxClickMovement) 
        {
          var eventObj = core.bom.event.Pointer.obtain(e, "tap");
          callback(eventObj);
          eventObj.release();
        }
      };

      target[eventId] = [down, up];

      core.bom.PointerEventsNext.add(target, "down", down);
      core.bom.PointerEventsNext.add(target, "up", up);
    },

    remove : function(target, type, callback, capture)
    {
      var eventId = core.bom.event.Util.getId(type, callback, capture);
      var eventHandler = target[eventId];
      if (!eventHandler) {
        return;
      }

      core.bom.PointerEventsNext.remove(target, "down", eventHandler[0]);
      core.bom.PointerEventsNext.remove(target, "up", eventHandler[1]);

      // Cheap cleanup
      target[eventId] = null;
    }
  });

})();

