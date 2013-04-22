/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on experimental by Andrea Giammarchi - Mit Style License
  https://github.com/WebReflection/experimental
==================================================================================================
*/

"use strict";

(function() 
{
  var cache = {};
  var hasOwnProperty = cache.hasOwnProperty;
  var prefixes = "O|o|MS|ms|Moz|moz|WebKit|Webkit|webKit|webkit|".split("|");

  function find(object, what) 
  {
    var firstChar = what.charAt(0);
    var what = what.slice(1);

    for (var i = prefixes.length, key; i--;) 
    {
      key = prefixes[i];
      key += (key ? firstChar.toUpperCase() : firstChar) + what;

      if (key in object || ("on" + key).toLowerCase() in object) {
        return key;
      }
    }

    return null;
  }

  /**
   * Utility for figuring out the given name of a experimental property / API.
   */
  core.Module("core.util.Experimental", 
  {
    /**
     * {String} Returns the name of @what {String} on the given @object {Object}.
     */
    get : function(object, what) 
    {
      var result = cache[what];
      if (result !== null) {
        result = cache[what] = find(object, what)
      }
        
      return result;
    }
  });
})();
