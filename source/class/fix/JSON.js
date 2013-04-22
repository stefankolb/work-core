/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function(global, undef) 
{
  var json = global.JSON;
  if (!json) {
    return;
  }

  // Fix Safari issue throwing errors when "undefined" is passed in
  try
  {
    json.stringify();
  }
  catch(ex) 
  {
    var stringifyOrig = json.stringify;
    json.stringify = function(value) {
      return value === undef ? value : stringifyOrig.apply(json, arguments);
    };
  }

})(core.Main.getGlobal());
