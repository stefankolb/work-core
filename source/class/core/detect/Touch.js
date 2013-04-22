/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function(global) 
{
  var value = false;

  if (jasy.Env.isSet("runtime", "browser"))
  {
    value = 'ontouchstart' in global;
    if (!value)
    {
      var property = core.util.Experimental.get(navigator, "maxTouchPoints");
      value = !!property && navigator[property] > 0;
    }
  }

  /**
   * Detects whether the device supports touch events
   */
  core.Module("core.detect.Touch", 
  {
    /**
     * {=Boolean} Whether the device supports touch events
     */
    VALUE : value
  });
})(core.Main.getGlobal());
