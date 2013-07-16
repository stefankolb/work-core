/**
 * #require(core.bom.PointerEvents2)
 */
core.Module("core.bom.TapEvent",
{
  init : function()
  {
    var downOn = null;
    var downX = -1000;
    var downY = -1000;
    var maxClickMovement = 5;

    document.addEventListener("pointerdown", function(e) 
    {
      if (!e.isPrimary) {
        return;
      }

      downOn = e.target;
      downX = e.offsetX;
      downY = e.offsetY;
    }, true);

    document.addEventListener("pointerup", function(e) 
    {
      if (!e.isPrimary) {
        return;
      }

      if (e.target == downOn && Math.abs(downX - e.offsetX) < maxClickMovement && Math.abs(downY - e.offsetY) < maxClickMovement) 
      {
        core.bom.TouchLikeEvent.create(e, "tap");
      }
    }, true);
  }
});
