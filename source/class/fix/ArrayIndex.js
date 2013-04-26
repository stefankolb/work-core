/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on ES5-Shim
  https://github.com/kriskowal/es5-shim
  Copyright 2009-2012 by contributors, MIT License  
==================================================================================================
*/

"use strict";

/**
 * This fixes the missing support of Array.indexOf/Array.lastIndexOf in IE < 9.
 */
core.Main.addMembers("Array",
{
  /**
   *
   *
   * - ES5 15.4.4.14
   * - http://es5.github.com/#x15.4.4.14
   * - https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf    
   */
  indexOf : function(sought /*, fromIndex */ ) 
  {
    var self = splitString && _toString(this) == "[object String]" ?
        this.split("") :
        toObject(this),
      length = self.length >>> 0;

    if (!length) {
      return -1;
    }

    var i = 0;
    if (arguments.length > 1) {
      i = toInteger(arguments[1]);
    }

    // handle negative indices
    i = i >= 0 ? i : Math.max(0, length + i);
    for (; i < length; i++) {
      if (i in self && self[i] === sought) {
        return i;
      }
    }
    return -1;
  },


  /**
   *
   *
   *
   * - ES5 15.4.4.15
   * - http://es5.github.com/#x15.4.4.15
   * - https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
   */
  lastIndexOf : function(sought /*, fromIndex */) 
  {
    var self = splitString && _toString(this) == "[object String]" ?
        this.split("") :
        toObject(this),
      length = self.length >>> 0;

    if (!length) {
      return -1;
    }
    var i = length - 1;
    if (arguments.length > 1) {
      i = Math.min(i, toInteger(arguments[1]));
    }

    // handle negative indices
    i = i >= 0 ? i : length - Math.abs(i);
    for (; i >= 0; i--) 
    {
      if (i in self && sought === self[i]) {
        return i;
      }
    }

    return -1;
  }
});

