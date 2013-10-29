/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 *
 */
core.Module("core.io.Util",
{
  isStatusOkay : function(code) {
    return code >= 200 && code < 300 || code == 304 || code == 1223;
  }
});
