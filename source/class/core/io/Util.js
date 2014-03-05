/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013-2014 Sebastian Werner
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
  },

  isRelativeUrl : function(uri)
  {
    if (core.String.startsWith(uri, "http://")) {
      return false;
    }

    if (core.String.startsWith(uri, "https://")) {
      return false;
    }

    if (core.String.startsWith(uri, "/")) {
      return false;
    }

    return true;
  }
});
