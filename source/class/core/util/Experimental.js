/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2012-2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on experimental by Andrea Giammarchi - Mit Style License
  https://github.com/WebReflection/experimental
==================================================================================================
*/

(function(cache) 
{
  var hasOwnProperty = cache.hasOwnProperty;
  var prefixes = 
  [
    "O", "o",
    "MS", "ms",
    "Moz", "moz",
    "WebKit", "Webkit", "webKit", "webkit",
    ""
  ];

  function find(object, what) 
  {
    for(var
      firstChar = what.charAt(0),
      what = what.slice(1),
      i = prefixes.length,
      key; i--;
    ) {
      key = prefixes[i];
      key += (
        key ? firstChar.toUpperCase() : firstChar
      ) + what;
      if (
        key in object ||
        ("on" + key).toLowerCase() in object
      ) return key;
    }
  }

  core.Module.define("core.util.Experimental", 
  {
    get : function(object, what, assign) 
    {
      var result = cache[what] || (
        cache[what] = find(object, what)
      );

      if (assign && result && !hasOwnProperty.call(object, what)) {
        object[what] = object[result];
      }

      return result;
    }
  });
})({});
