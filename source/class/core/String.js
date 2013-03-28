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

  /**
   * A collection of utility methods for native JavaScript strings.
   */
  core.Module("core.String",
  {
    /**
     * {String} Converts the @str {String} into a hex string
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
     * {String} Encodes the @str {String} as UTF-8.
     *
     * Via: http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html
     */
    encodeUtf8 : function(str) {
      return unescape(encodeURIComponent(str));
    },
    
    
    /**
     * {String} Decodes the @str {String} from UTF-8.
     *
     * Via: http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html
     */
    decodeUtf8 : function(str) {
      return decodeURIComponent(escape(str));
    },


    /**
     * Whether the @str {String} contains the given @substring {String}.
     */
    contains : function(str, substring) {
      return str.indexOf(substring) != -1;
    },


    /**
     * {Boolean} Returns true if the @str {String} has a length of 0 or contains only whitespace.
     */
    isBlank : function(str) {
      return str.trim().length == 0;
    },


    /**
     * {String} Reverses the @str {String}.
     */
    reverse : function(str) {
      return str.split("").reverse().join("");
    },


    /**
     * {String} Removes double spaces and line breaks from the @str {String}.
     */
    compact : function(str) {
      return str.replace(/[\r\n]/g, " ").trim().replace(/([\s　])+/g, '$1');
    },


    /**
     * {String} Hyphenates the @str {String} like:
     *
     * - `camelCase` => `camel-case`
     * - `HelloWorld` => `-hello-world`
     */
    hyphenate : function(str) {
      return str.replace(/[A-Z]/g,'-$&').toLowerCase();
    },


    /**
     * {String} Camelizes this @str {String} like:
     *
     * - `camel-case => camelCase`
     * - `-hello-world => HelloWorld`
     */
    camelize : function(str)
    {
      return str.replace(/\-+(\S)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    },


    /**
     * {String} Returns a new @str {String} which is a @nr {Integer} repeated copy of the original one.
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
     * {Boolean} Returns `true` if the @str {String} starts with the given substring @begin {String}
     */
    startsWith : function(str, begin) {
      return begin == str.slice(0, begin.length);
    },


    /**
     * {Boolean} Returns `true` if the @str {String} ends with the given substring @end {String}
     */
    endsWith : function(str, end) {
      return end == str.slice(-end.length);
    }  
  });
})();
