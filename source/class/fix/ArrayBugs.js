/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on ES5-Shim
  https://github.com/kriskowal/es5-shim
  Copyright 2009-2013 by contributors, MIT License  
==================================================================================================
*/

"use strict";

(function(undef)
{
  var ArrayProto = Array.prototype;

  // ES5 15.4.4.12
  // http://es5.github.com/#x15.4.4.12
  // Default value for second param
  // IE < 9 bug: [1,2].splice(0).join("") == "" but should be "12"
  if ([1,2].splice(0).length != 2) 
  {
    var array_splice = ArrayProto.splice;
    
    ArrayProto.splice = function(start, deleteCount) 
    {
      if (!arguments.length) 
      {
         return [];
      }
      else
      {
        return array_splice.apply(this, [
          start === undef ? 0 : start,
          deleteCount === undef ? (this.length - start) : deleteCount
        ].concat(slice.call(arguments, 2)));
      }
    };
  }

  // ES5 15.4.4.12
  // http://es5.github.com/#x15.4.4.13
  // Return len+argCount.
  // IE < 8 bug: [].unshift(0) == undefined but should be "1"
  if ([].unshift(0) != 1) 
  {
    var array_unshift = ArrayProto.unshift;

    ArrayProto.unshift = function() 
    {
      array_unshift.apply(this, arguments);
      return this.length;
    };
  }
})();
