/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function(global)
{
  var storage = global.localStorage;

  /**
   * Wrapped Storage API to store small data fragments on the client
   */
  core.Module("core.bom.Storage",
  {
    set : function(key, value)
    {
      if (jasy.Env.isSet("debug"))
      {
        core.Assert.isType(key, "String");
        core.Assert.isType(value, "Plain", "Invalid data type to store!");
      }

      // Auto cast JSON objects and mark as JSON
      if (typeof value == "object") {
        value = "@J@" + core.JSON.stringify(value);
      }
      
      var text = core.JSON.stringify(value);
      var compressed = core.util.TextCompressor.compress(text);

      storage.setItem(key, compressed);
    },


    get : function(key)
    {
      if (jasy.Env.isSet("debug")) {
        core.Assert.isType(key, "String");
      }

      var compressed = storage.getItem(key, compressed);
      if (compressed == null) {
        return compressed;
      }

      var text = core.util.TextCompressor.decompress(compressed);

      var type = text.slice(0,3);
      if (type == "@J@") {
        var value = core.JSON.parse(text.slice(3));
      } else {
        var value = text;
      }

      return value;
    },


    remove : function(key)
    {
      if (jasy.Env.isSet("debug")) {
        core.Assert.isType(key, "String");
      }

      storage.removeItem(key);
    }

  });


})(core.Main.getGlobal());
