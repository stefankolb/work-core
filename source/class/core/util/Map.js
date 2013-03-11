/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
==================================================================================================
*/

"use strict";

/**
 * Utilities for working with Maps.
 */
core.Module("core.util.Map",
{
  /**
   * {Map} Returns a copy of the incoming @map {Map} where the 
   * keys in @table {Map} are translated. All keys which are not
   * listed in @table are just copied over to the result object.
   */
  translate : function(map, table)
  {
    var result = {};
    for (var key in map) {
      result[table[key] || key] = map[key];
    }

    return result;
  }
});
