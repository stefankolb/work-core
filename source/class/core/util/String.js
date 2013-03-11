/*
==================================================================================================
  Core - JavaScript Foundation
  Copyright 2013 Sebastian Werner
==================================================================================================
*/

"use strict";

(function()
{
  var hexTable = "0123456789abcdef".split("");

  core.Module("core.util.String",
  {
    /**
     * {String} Converts the string into a hex string
     */
    toHex : function(str) 
    {
      var output = "";
      var code;

      for (var i = 0, l = str.length; i < l; i++)
      {
        code = str.charCodeAt(i);
        output += hexTable[(code >>> 4) & 0x0F] + hexTable[code & 0x0F];
      }

      return output;
    },

    
    /**
     * {String} Encodes the string as UTF-8.
     *
     * Via: http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html
     */
    encodeUtf8 : function(str) {
      return unescape(encodeURIComponent(str));
    },
    
    
    /**
     * {String} Decodes the string from UTF-8.
     *
     * Via: http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html
     */
    decodeUtf8 : function(str) {
      return decodeURIComponent(escape(str));
    },


    /**
     * Whether the string contains the given @substring {String}.
     */
    contains : function(fullstring, substring) {
      return fullstring.indexOf(substring) != -1;
    },


    /**
     * {Boolean} Returns true if the string has a length of 0 or contains only whitespace.
     */
    isBlank : function(str) {
      return str.trim().length == 0;
    },


    /**
     * {String} Reverses the string
     */
    reverse : function(str) {
      return str.split("").reverse().join("");
    },


    /**
     * {String} Removes double spaces and line breaks.
     */
    compact : function(str) {
      return str.replace(/[\r\n]/g, " ").trim().replace(/([\s　])+/g, '$1');
    },


    /**
     * {String} Returns a hyphenated copy of the original string e.g.
     *
     * - camelCase => camel-case
     * - HelloWorld => -hello-world
     */
    hyphenate : function(str) 
    {
      // Via: http://es5.github.com/#x15.5.4.11
      return str.replace(/[A-Z]/g,'-$&').toLowerCase();
    },


    /**
     * {String} Camelizes this string.
     */
    camelize : function(str)
    {
      return str.replace(/\-+(\S)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    },


    /**
     * {String} Returns a new string which is a @nr {Integer} repeated copy of the original one.
     */
    repeat : function(str, nr)
    {
      // Optimized by: http://jsperf.com/repeat-vs-repeat/3
      if (nr < 1) {
        return '';
      }
      
      var pattern = str;
      var result = "";
      while (nr > 0) 
      {
        if (nr & 1) {
          result += pattern;
        }
        
        nr >>= 1;
        pattern += pattern;
      }

      return result;
    },


    /**
     * {Boolean} Returns `true` if this string starts with the given substring @begin {String}
     */
    startsWith : function(str, begin) {
      return begin == str.slice(0, begin.length);
    },


    /**
     * {Boolean} Returns `true` if this string ends with the given substring @end {String}
     */
    endsWith : function(str, end) {
      return end == str.slice(-end.length);
    }  
  });
})();
