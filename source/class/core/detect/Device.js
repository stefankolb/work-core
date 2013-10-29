/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

(function()
{
  var value = "other";

  if (jasy.Env.isSet("runtime", "browser"))
  {
    // Androids native system browser is buggy
    if (core.detect.Browser.NAME == "android") {
      var largest = Math.max(window.innerWidth, window.innerHeight);
    } else {
      var largest = Math.max(screen.width, screen.height);
    }

    if (largest > 1000) {
      value = "desktop";
    } else if (largest > 700) {
      value = "tablet";
    } else {
      value = "phone";
    }
  }

  core.Module("core.detect.Device",
  {
    /** {=String} Any of desktop, tablet, smartphone or other */
    VALUE : value
  });
})();
