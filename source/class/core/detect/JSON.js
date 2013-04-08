"use strict";

/*
 * Based on JSON v3.2.4
 * http://bestiejs.github.com/json3
 * Copyright 2012, Kit Cambridge
 * http://kit.mit-license.org
 */
(function(global, Date)
{
  var JSON = global.JSON;
  var serialized = '{"A":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';

  var parseSupported = JSON && typeof JSON.parse == "function";
  var stringifySupported = JSON && typeof JSON.stringify == "function";

  var PARSE = "parse";
  var STRINGIFY = "stringify";

  if (parseSupported)
  {
    (function()
    {
      try 
      {
        // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
        // Conforming implementations should also coerce the initial argument to
        // a string prior to parsing.
        if (JSON[PARSE]("0") === 0 && !JSON[PARSE](false)) 
        {
          // Simple parsing test.
          var value = JSON[PARSE](serialized);

          if ((parseSupported = value.A.length == 5 && value.A[0] == 1)) 
          {
            try 
            {
              // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
              parseSupported = !JSON[PARSE]('"\t"');
            } 
            catch (exception) {}
            
            if (parseSupported) 
            {
              try 
              {
                // FF 4.0 and 4.0.1 allow leading `+` signs, and leading and
                // trailing decimal points. FF 4.0, 4.0.1, and IE 9-10 also
                // allow certain octal literals.
                parseSupported = JSON[PARSE]("01") != 1;
              }
              catch (exception) {}
            }
          }
        }
      } catch (exception) {
        parseSupported = false;
      }
    })();
  }

  if (stringifySupported)
  {
    (function() 
    {
      var value, undef;
      var getClass = Object.prototype.toString;

      // A test function object with a custom `toJSON` method.
      (value = function () {
        return 1;
      }).toJSON = value;
      
      try 
      {
        stringifySupported =
          
          // Firefox 3.1b1 and b2 serialize string, number, and boolean
          // primitives as object literals.
          JSON[STRINGIFY](0) === "0" &&
          
          // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
          // literals.
          JSON[STRINGIFY](new Number()) === "0" &&
          JSON[STRINGIFY](new String()) == '""' &&
          
          // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
          // does not define a canonical JSON representation (this applies to
          // objects with `toJSON` properties as well, *unless* they are nested
          // within an object or array).
          JSON[STRINGIFY](getClass) === undef &&
          
          // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
          // FF 3.1b3 pass this test.
          JSON[STRINGIFY](undef) === undef &&
          
          // Safari < 7 (?) and FF 3.1b3 throw `Error`s and `TypeError`s,
          // respectively, if the value is omitted entirely.
          JSON[STRINGIFY]() === undef &&
          
          // FF 3.1b1, 2 throw an error if the given value is not a number,
          // string, array, object, Boolean, or `null` literal. This applies to
          // objects with custom `toJSON` methods as well, unless they are nested
          // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
          // methods entirely.
          JSON[STRINGIFY](value) === "1" &&
          JSON[STRINGIFY]([value]) == "[1]" &&

          // FF 3.1b1, 2 halts serialization if an array contains a function:
          // `[1, true, getClass, 1]` serializes as "[1,true,],". These versions
          // of Firefox also allow trailing commas in JSON objects and arrays.
          // FF 3.1b3 elides non-JSON values from objects and arrays, unless they
          // define custom `toJSON` methods.
          JSON[STRINGIFY]([undef, getClass, null]) == "[null,null,null]" &&
          
          // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
          // where character escape codes are expected (e.g., `\b` => `\u0008`).
          JSON[STRINGIFY]({ "A": [value, true, false, null, "\0\b\n\f\r\t"] }) == serialized &&
          
          // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
          JSON[STRINGIFY](null, value) === "1" &&
          JSON[STRINGIFY]([1, 2], null, 1) == "[\n 1,\n 2\n]"; 

          // These are already fixed by `fix.DateIso`
          
          // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
          // serialize extended years.
          // JSON[STRINGIFY](new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
          
          // The milliseconds are optional in ES 5, but required in 5.1.
          // JSON[STRINGIFY](new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
          
          // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
          // four-digit years instead of six-digit years. Credits: @Yaffle.
          // JSON[STRINGIFY](new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
          
          // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
          // values less than 1000. Credits: @Yaffle.
          // JSON[STRINGIFY](new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
      } 
      catch (exception) {
        stringifySupported = false;
      }
    })();
  }

  /**
   * This module checks whether JSON is available and implemented correctly.
   */
  core.Module("core.detect.JSON", 
  {
    VALID_PARSE : parseSupported,
    VALID_STRINGIFY : stringifySupported,

    VALUE : parseSupported && stringifySupported
  });

})(core.Main.getGlobal(), Date);
