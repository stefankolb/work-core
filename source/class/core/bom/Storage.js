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
    /**
     * Stores the given @value {any} under the given @key {String}.
     */
    set : function(key, value)
    {
      if (jasy.Env.isSet("debug"))
      {
        core.Assert.isType(key, "String");
        core.Assert.isType(value, "Plain", "Invalid data type to store!");
      }

      // Auto cast JSON objects and mark as JSON
      if (typeof value == "object") {
        var text = "@J@" + core.JSON.stringify(value);
      } else {
        var text = value;
      }
      
      var compressed = core.util.TextCompressor.compress(text);

      storage.setItem(key, compressed);
    },


    /**
     * {any} Returns the value of the given @key.
     */
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


    /**
     * Removes the given @key {String} from the storage.
     */
    remove : function(key)
    {
      if (jasy.Env.isSet("debug")) {
        core.Assert.isType(key, "String");
      }

      storage.removeItem(key);
    }
  });

})(core.Main.getGlobal());
