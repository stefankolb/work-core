(function() 
{
  var value = false;

  if (jasy.Env.isSet("runtime", "browser"))
  {
    var win = window;

    if (win.devicePixelRatio > 1) {
      value = true;
    } 
    else if (win.matchMedia)
    {
      if (win.matchMedia('(-webkit-min-device-pixel-ratio: 2)').matches) {
        value = true;
      } else if (win.matchMedia('(-o-min-device-pixel-ratio: 1/1)').matches) {
        value = true;
      } else if (window.matchMedia('(min-resolution: 96dpi)').matches) {
        value = true;
      }
    }
  }
  
  core.Module("core.detect.HighRes", 
  {
    VALUE : value
  });
})();
