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
 * Adds or fixes `Date.prototype.toISOString`.
 *
 * See also: http://kangax.github.io/es5-compat-table/
 */
(function()
{
  // ES5 15.9.5.43
  // http://es5.github.com/#x15.9.5.43
  // This function returns a String value represent the instance in time
  // represented by this Date object. The format of the String is the Date Time
  // string format defined in 15.9.1.15. All fields are present in the String.
  // The time zone is always UTC, denoted by the suffix Z. If the time value of
  // this object is not a finite Number a RangeError exception is thrown.
  var negativeDate = -62198755200000;
  var negativeYearString = "-000001";

  if (!Date.prototype.toISOString || (new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1)) 
  {
    core.Main.addMembers("Date",
    {
      toISOString : function() 
      {
        var self = this;
        var result, length, value, year, month;
        if (!isFinite(self)) {
          throw new RangeError("Date.prototype.toISOString called on non-finite value.");
        }

        year = self.getUTCFullYear();
        month = self.getUTCMonth();

        // see https://github.com/kriskowal/es5-shim/issues/111
        year += Math.floor(month / 12);
        month = (month % 12 + 12) % 12;

        // the date time string format is specified in 15.9.1.15.
        result = [month + 1, self.getUTCDate(), self.getUTCHours(), self.getUTCMinutes(), self.getUTCSeconds()];
        
        year = (
          (year < 0 ? "-" : (year > 9999 ? "+" : "")) +
          ("00000" + Math.abs(year))
          .slice(0 <= year && year <= 9999 ? -4 : -6)
        );

        length = result.length;
        while (length--) 
        {
          value = result[length];
          
          // pad months, days, hours, minutes, and seconds to have two digits.
          if (value < 10) {
            result[length] = "0" + value;
          }
        }

        // pad milliseconds to have three digits.
        return (
          year + "-" + result.slice(0, 2).join("-") +
          "T" + result.slice(2).join(":") + "." +
          ("000" + self.getUTCMilliseconds()).slice(-3) + "Z"
        );
      }
    }, true);
  }
})();
